from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import Optional
from sklearn.preprocessing import LabelEncoder
import torch
import cv2
import numpy as np
from torchvision import models
from PIL import Image
import io
import pandas as pd
import pickle

from source.medical_agent import MedicalAgent
from source.wiki_agent import WikiAgent
from source.cnn import CustomCNN, preprocess_image_resnet, preprocess_image_cnn

# Define request model
class QueryRequest(BaseModel):
    query: str
    source: Optional[str] = "wiki"

class SleepDataRequest(BaseModel):
    bloodPressure: int
    age: int
    heartRate: float
    dailySteps: int
    sleepDuration: float
    sleepQuality: int
    physicalActivity: int
    gender: str
    job: str
    weight: str
    stressLevelCondition: float

agent = MedicalAgent()
wiki_agent = WikiAgent()

device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

# Resnet    
# model = models.resnet18(pretrained=True)
# model.fc = torch.nn.Linear(model.fc.in_features, 2)  # Adjust for binary classification
# model.load_state_dict(torch.load('../models/resnet18.pth', map_location=device))  # Load the model weights
# model.to(device)
# model.eval()

# CNN
model = CustomCNN()
model.load_state_dict(torch.load('../models/cnn.pth', map_location=device))
model.to(device)
model.eval()

# Load the pre-saved label encoders (assuming you've saved them with pickle)
categories = ['Gender', 'Age', 'Occupation', 'Sleep Duration', 'Physical Activity Level', 'BMI Category', 'Heart Rate', 'Daily Steps', 'Sleep Disorder']
# Create a dictionary to hold LabelEncoders for each column
encoders = {}
data_ori = pd.read_csv("../healthcare/Sleep_health_and_lifestyle_dataset.csv")
# Fit LabelEncoders on the categorical columns and transform them
for col in categories:
    le = LabelEncoder()
    data_ori[col] = le.fit_transform(data_ori[col])  # Encode the column
    encoders[col] = le  # Store the LabelEncoder for future use
with open('../models/sleep-prediction-weights.pkl', 'rb') as f:
    sleep_model = pickle.load(f)

# FastAPI initialization
origins = ["*"]
app_api = FastAPI()
app_api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check route
@app_api.get("/")
def health_check():
    return {"status": "OK"}

# RAG (retrieval-augmented generation) endpoint (for existing text-based query)
@app_api.post("/rag/{source}")
async def chat(request: QueryRequest):
    try:
        if request.source == "wiki":
            response = wiki_agent.invoke(request.query)
        else:
            request = {"user_input": request.query}
            response = agent.invoke(request)
        return JSONResponse(content=jsonable_encoder(response))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# New endpoint for image classification
@app_api.post("/image-predict/")
async def classify_image(file: UploadFile = File(...)):
    try:
        # Read the image bytes from the file
        image_bytes = await file.read()

        # Preprocess the image and perform inference
        image_tensor = preprocess_image_cnn(image_bytes)

        # Perform inference
        with torch.no_grad():
            outputs = model(image_tensor)
            _, predicted = torch.max(outputs, 1)  # Get the predicted class label
        
        # Return the prediction
        return {"is_pneunomia": predicted.item()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app_api.post("/sleep-predict/")
async def predict_sleep_disorder(request: SleepDataRequest):
    try:
        # Prepare the input data
        data = {
            "Gender": request.gender,
            "Age": request.age,
            "Occupation": request.job,
            "Sleep Duration": request.sleepDuration,
            "Quality of Sleep": request.sleepQuality,
            "Physical Activity Level": request.physicalActivity,
            "Stress Level": request.stressLevelCondition,
            "BMI Category": request.weight,
            "Blood Pressure": request.bloodPressure,
            "Heart Rate": request.heartRate,
            "Daily Steps": request.dailySteps,
        }

        new_data = pd.DataFrame(data, index=[0])

        # Preprocessing
        # Encode the categorical columns using the pre-fitted LabelEncoders
        for col in categories:
            if col in new_data.columns:
                try:
                    print(new_data[col])
                    new_data[col] = encoders[col].transform(new_data[col])
                except ValueError:
                    print(f"Unseen label found in column '{col}'. Mapping to default.")
                    new_data[col] = 0  # Map unseen labels to a default value (e.g., 0)

        print(new_data)

        # 4. Use the model to predict sleep disorder
        output = sleep_model.predict(new_data)

        # Return prediction result
        if output[0] == 0:
            prediction = "Giấc ngủ bình thường"
        elif output[0] == 1:
            prediction = "Rối loạn giấc ngủ"
        else:
            prediction = "Có dấu hiệu của tình trạng ngưng thở khi ngủ"
        return {"prediction": prediction}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
