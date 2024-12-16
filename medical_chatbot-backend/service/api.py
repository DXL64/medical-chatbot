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
    
