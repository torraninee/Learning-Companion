import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

model = joblib.load("personalized_schedule_model.joblib")
feature_columns = joblib.load("feature_columns.joblib")
personalized_schedule_api = FastAPI()

personalized_schedule_api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@personalized_schedule_api.post("/predict-timing")
def predict_timing(user_input: dict):
    input_row = {column: 0 for column in feature_columns}
    for key, value in user_input.items():
        if key in input_row:
            input_row[key] = value

    input_data = pd.DataFrame([input_row], columns=feature_columns)
    predicted_minutes = float(model.predict(input_data)[0])

    return {
        "Predicted Minutes": round(predicted_minutes)
    }