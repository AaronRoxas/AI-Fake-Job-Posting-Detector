"""
Vercel Serverless Function Handler for FastAPI Backend
"""
import os
import sys
from pathlib import Path

# Get the backend directory (parent of api/)
backend_dir = Path(__file__).parent.parent

# Add backend directory to Python path
sys.path.insert(0, str(backend_dir))

# Change to backend directory so model files can be found
os.chdir(backend_dir)

# Import backend_api module
import backend_api

# Export the FastAPI app for Vercel
handler = backend_api.app

