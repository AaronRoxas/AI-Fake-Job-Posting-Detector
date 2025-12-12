"""
Fake Job Posting Detection - Backend API
=========================================
A FastAPI backend for detecting fraudulent job postings.

Required files in the same directory:
  - best_model.pkl
  - tfidf_vectorizer.pkl
  - onehot_encoder.pkl

Run with: uvicorn backend_api:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import joblib
import numpy as np
import pandas as pd
import re
from scipy.sparse import hstack
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Download NLTK data (run once)
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

# ============================================================================
# Initialize FastAPI App
# ============================================================================
app = FastAPI(
    title="Fake Job Posting Detection API",
    description="Detect fraudulent job postings using machine learning",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Load Model & Preprocessing Components (using joblib)
# ============================================================================
print("Loading model and preprocessing components...")

# Determine the correct path for model files (works in both dev and Vercel)
import os
from pathlib import Path

# Get the directory where this file is located
BACKEND_DIR = Path(__file__).parent.resolve()
MODEL_DIR = BACKEND_DIR

try:
    model_path = MODEL_DIR / 'best_model.pkl'
    vectorizer_path = MODEL_DIR / 'tfidf_vectorizer.pkl'
    encoder_path = MODEL_DIR / 'onehot_encoder.pkl'
    
    model = joblib.load(str(model_path))
    tfidf_vectorizer = joblib.load(str(vectorizer_path))
    onehot_encoder = joblib.load(str(encoder_path))
    print("✓ All components loaded successfully!")
except FileNotFoundError as e:
    print(f"Error: {e}")
    print(f"Looking in: {MODEL_DIR}")
    print("Make sure best_model.pkl, tfidf_vectorizer.pkl, and onehot_encoder.pkl are in the backend directory.")
    raise

# Initialize NLP tools
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Feature columns (must match training)
CATEGORICAL_COLS = ['employment_type', 'required_experience', 'required_education']
NUMERIC_COLS = ['telecommuting', 'has_company_logo', 'has_questions']

# ============================================================================
# Request/Response Models
# ============================================================================
class JobPosting(BaseModel):
    """Input schema for job posting prediction"""
    title: str
    company_profile: Optional[str] = ""
    description: str
    requirements: Optional[str] = ""
    benefits: Optional[str] = ""
    telecommuting: Optional[int] = 0
    has_company_logo: Optional[int] = 0
    has_questions: Optional[int] = 0
    employment_type: Optional[str] = "Unknown"
    required_experience: Optional[str] = "Unknown"
    required_education: Optional[str] = "Unknown"

class PredictionResponse(BaseModel):
    """Output schema for prediction result"""
    is_fake: bool
    prediction: str
    confidence: float
    fake_probability: float
    real_probability: float
    risk_level: str

# ============================================================================
# Text Preprocessing Function
# ============================================================================
def clean_text(text: str) -> str:
    """Clean and preprocess text for model input"""
    if not isinstance(text, str):
        return ""
    
    # Lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    # Tokenize
    try:
        tokens = word_tokenize(text)
    except:
        tokens = text.split()
    
    # Remove stopwords and lemmatize
    cleaned_tokens = [
        lemmatizer.lemmatize(word) 
        for word in tokens 
        if word not in stop_words and len(word) > 2
    ]
    
    return ' '.join(cleaned_tokens)

# ============================================================================
# Prediction Function
# ============================================================================
def predict_job_posting(job: JobPosting) -> dict:
    """Process job posting and return prediction"""
    
    # Combine text features
    combined_text = ' '.join([
        job.title or '',
        job.company_profile or '',
        job.description or '',
        job.requirements or '',
        job.benefits or ''
    ])
    
    # Clean text
    cleaned_text = clean_text(combined_text)
    
    # TF-IDF transformation
    X_tfidf = tfidf_vectorizer.transform([cleaned_text])
    
    # One-hot encode categorical features
    cat_df = pd.DataFrame({
        'employment_type': [job.employment_type or 'Unknown'],
        'required_experience': [job.required_experience or 'Unknown'],
        'required_education': [job.required_education or 'Unknown']
    })
    X_categorical = onehot_encoder.transform(cat_df)
    
    # Numeric features
    X_numeric = np.array([[
        job.telecommuting or 0,
        job.has_company_logo or 0,
        job.has_questions or 0
    ]])
    
    # Combine all features
    X_combined = hstack([X_tfidf, X_categorical, X_numeric])
    
    # Make prediction
    prediction = model.predict(X_combined)[0]
    probabilities = model.predict_proba(X_combined)[0]
    
    # Determine risk level
    fake_prob = probabilities[1]
    if fake_prob < 0.2:
        risk_level = "Low"
    elif fake_prob < 0.4:
        risk_level = "Moderate"
    elif fake_prob < 0.6:
        risk_level = "High"
    elif fake_prob < 0.8:
        risk_level = "Very High"
    else:
        risk_level = "Critical"
    
    return {
        "is_fake": bool(prediction == 1),
        "prediction": "FAKE" if prediction == 1 else "REAL",
        "confidence": float(max(probabilities) * 100),
        "fake_probability": float(probabilities[1] * 100),
        "real_probability": float(probabilities[0] * 100),
        "risk_level": risk_level
    }

# ============================================================================
# API Endpoints
# ============================================================================
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "Fake Job Posting Detection API",
        "version": "1.0.0",
        "endpoints": {
            "predict": "POST /predict",
            "health": "GET /health"
        }
    }

@app.get("/health")
async def health_check():
    """Check if the model is loaded and ready"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "vectorizer_loaded": tfidf_vectorizer is not None,
        "encoder_loaded": onehot_encoder is not None
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(job: JobPosting):
    """
    Predict if a job posting is fake or real.
    
    Returns prediction with confidence scores and risk level.
    """
    try:
        result = predict_job_posting(job)
        return PredictionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# Run Server (for development)
# ============================================================================
if __name__ == "__main__":
    import uvicorn
    print("\n" + "=" * 60)
    print("Starting Fake Job Detection API Server...")
    print("=" * 60)
    print("\nAPI Documentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    print("\n" + "=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000)

