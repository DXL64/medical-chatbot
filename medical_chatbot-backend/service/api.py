from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import Optional, List
import torch
import numpy as np
import pandas as pd
import pickle

from source.medical_agent import MedicalAgent
from source.wiki_agent import WikiAgent
from source.cnn import CustomCNN, preprocess_image_resnet, preprocess_image_cnn

# Define request model
class QueryRequest(BaseModel):
    query: str
    source: Optional[str] = "wiki"

class DiseaseDataRequest(BaseModel):
    symptom_list: List[str]

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

# Load the model
model = pickle.load(open('../models/DecisionTrees.pkl', 'rb'))

# Define the symptoms
diseases = [
    '(vertigo) Paroymsal  Positional Vertigo', 'AIDS', 'Acne', 'Alcoholic hepatitis', 'Allergy', 
    'Arthritis', 'Bronchial Asthma', 'Cervical spondylosis', 'Chicken pox', 'Chronic cholestasis', 
    'Common Cold', 'Dengue', 'Diabetes', 'Dimorphic hemmorhoids(piles)', 'Drug Reaction', 
    'Fungal infection', 'GERD', 'Gastroenteritis', 'Heart attack', 'Hepatitis B', 'Hepatitis C', 
    'Hepatitis D', 'Hepatitis E', 'Hypertension', 'Hyperthyroidism', 'Hypoglycemia', 'Hypothyroidism', 
    'Impetigo', 'Jaundice', 'Malaria', 'Migraine', 'Osteoarthristis', 'Paralysis (brain hemorrhage)', 
    'Peptic ulcer diseae', 'Pneumonia', 'Psoriasis', 'Tuberculosis', 'Typhoid', 
    'Urinary tract infection', 'Varicose veins', 'hepatitis A'
]

symptoms = ['itching',
 'skin_rash',
 'nodal_skin_eruptions',
 'dischromic _patches',
 'continuous_sneezing',
 'shivering',
 'chills',
 'watering_from_eyes',
 'stomach_pain',
 'acidity',
 'ulcers_on_tongue',
 'vomiting',
 'cough',
 'chest_pain',
 'yellowish_skin',
 'nausea',
 'loss_of_appetite',
 'abdominal_pain',
 'yellowing_of_eyes',
 'burning_micturition',
 'spotting_ urination',
 'passage_of_gases',
 'internal_itching',
 'indigestion',
 'muscle_wasting',
 'patches_in_throat',
 'high_fever',
 'extra_marital_contacts',
 'fatigue',
 'weight_loss',
 'restlessness',
 'lethargy',
 'irregular_sugar_level',
 'blurred_and_distorted_vision',
 'obesity',
 'excessive_hunger',
 'increased_appetite',
 'polyuria',
 'sunken_eyes',
 'dehydration',
 'diarrhoea',
 'breathlessness',
 'family_history',
 'mucoid_sputum',
 'headache',
 'dizziness',
 'loss_of_balance',
 'lack_of_concentration',
 'stiff_neck',
 'depression',
 'irritability',
 'visual_disturbances',
 'back_pain',
 'weakness_in_limbs',
 'neck_pain',
 'weakness_of_one_body_side',
 'altered_sensorium',
 'dark_urine',
 'sweating',
 'muscle_pain',
 'mild_fever',
 'swelled_lymph_nodes',
 'malaise',
 'red_spots_over_body',
 'joint_pain',
 'pain_behind_the_eyes',
 'constipation',
 'toxic_look_(typhos)',
 'belly_pain',
 'yellow_urine',
 'receiving_blood_transfusion',
 'receiving_unsterile_injections',
 'coma',
 'stomach_bleeding',
 'acute_liver_failure',
 'swelling_of_stomach',
 'distention_of_abdomen',
 'history_of_alcohol_consumption',
 'fluid_overload',
 'phlegm',
 'blood_in_sputum',
 'throat_irritation',
 'redness_of_eyes',
 'sinus_pressure',
 'runny_nose',
 'congestion',
 'loss_of_smell',
 'fast_heart_rate',
 'rusty_sputum',
 'pain_during_bowel_movements',
 'pain_in_anal_region',
 'bloody_stool',
 'irritation_in_anus',
 'cramps',
 'bruising',
 'swollen_legs',
 'swollen_blood_vessels',
 'prominent_veins_on_calf',
 'weight_gain',
 'cold_hands_and_feets',
 'mood_swings',
 'puffy_face_and_eyes',
 'enlarged_thyroid',
 'brittle_nails',
 'swollen_extremeties',
 'abnormal_menstruation',
 'muscle_weakness',
 'anxiety',
 'slurred_speech',
 'palpitations',
 'drying_and_tingling_lips',
 'knee_pain',
 'hip_joint_pain',
 'swelling_joints',
 'painful_walking',
 'movement_stiffness',
 'spinning_movements',
 'unsteadiness',
 'pus_filled_pimples',
 'blackheads',
 'scurring',
 'bladder_discomfort',
 'foul_smell_of urine',
 'continuous_feel_of_urine',
 'skin_peeling',
 'silver_like_dusting',
 'small_dents_in_nails',
 'inflammatory_nails',
 'blister',
 'red_sore_around_nose',
 'yellow_crust_ooze']

description = pd.read_csv("../healthcare/Diseases Detection/symptom_Description_translated.csv")
precaution = pd.read_csv("../healthcare/Diseases Detection/symptom_precaution_translated.csv")

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
    
@app_api.post('/predict/')
def predict(request: DiseaseDataRequest):
    # Get the data from the POST request
    data = request.symptom_list

    # Validate inputs and dependencies
    if not isinstance(data, list) or not all(isinstance(symptom, str) for symptom in data):
        return JSONResponse(content={"error": "Invalid symptom list"}, status_code=400)

    if not all(var in globals() for var in ['symptoms', 'model', 'description', 'precaution', 'diseases']):
        return JSONResponse(content={"error": "Required data is not available"}, status_code=500)

    # Create a list of zeros
    features = [0] * len(symptoms)

    # Set the corresponding indices to 1 for the symptoms present in the data
    for symptom in data:
        if symptom in symptoms:
            index = symptoms.index(symptom)
            features[index] = 1

    # Make prediction using the model
    try:
        proba = model.predict_proba([features])
    except Exception as e:
        return JSONResponse(content={"error": f"Model prediction failed: {str(e)}"}, status_code=500)

    # Get the indices and probabilities of the top 5 classes
    top5_idx = np.argsort(proba[0])[-5:][::-1]
    top5_proba = proba[0][top5_idx]

    # Sanitize probabilities to ensure JSON compliance
    top5_proba = [float(p) if np.isfinite(p) else 0.0 for p in top5_proba]

    # Get the names of the top 5 diseases
    top5_diseases = [diseases[i] for i in top5_idx]

    # Prepare the response
    response = []
    for i in range(len(top5_diseases)):
        disease = top5_diseases[i]
        probability = top5_proba[i]

        # Get the disease description
        disp = (
            description.loc[description['Disease'] == disease, 'Description'].values[0]
            if disease in description["Disease"].values
            else "No description available"
        )

        # Get the precautions
        precautions = []
        if disease in precaution["Disease"].values:
            row = precaution.loc[precaution['Disease'] == disease].iloc[0]
            precautions = [prec for prec in row.values[1:] if pd.notnull(prec)]

        # Add the disease prediction to the response
        response.append({
            'disease': disease,
            'probability': probability,
            'description': disp,
            'precautions': precautions
        })

    # Return the response
    return JSONResponse(content=jsonable_encoder(response))
