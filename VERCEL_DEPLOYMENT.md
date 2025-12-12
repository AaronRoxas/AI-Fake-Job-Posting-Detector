# Deploying to Vercel

This guide explains how to deploy both the frontend and backend to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Vercel CLI installed (optional, for CLI deployment): `npm i -g vercel`

## Project Structure

```
FakeJob/
├── frontend/          # Next.js frontend
├── backend/           # FastAPI backend
│   ├── api/
│   │   └── index.py   # Vercel serverless function handler
│   ├── backend_api.py # FastAPI application
│   ├── *.pkl          # ML model files
│   └── requirements.txt
└── vercel.json        # Vercel configuration
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import Project in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Vercel will auto-detect Next.js for the frontend

3. **Configure Environment Variables**
   - In your Vercel project settings, add:
     ```
     NEXT_PUBLIC_API_URL=https://your-project.vercel.app
     ```
   - Replace `your-project.vercel.app` with your actual Vercel deployment URL

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically:
     - Build the Next.js frontend
     - Deploy the Python backend as serverless functions
     - Include all `.pkl` model files

### Option 2: Deploy via CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter: https://your-project.vercel.app
   ```

## Important Notes

### Backend API Routes

After deployment, your backend API will be available at:
- `https://your-project.vercel.app/api/` - Root endpoint
- `https://your-project.vercel.app/api/predict` - Prediction endpoint
- `https://your-project.vercel.app/api/health` - Health check

### Model Files

The `.pkl` files (best_model.pkl, tfidf_vectorizer.pkl, onehot_encoder.pkl) are automatically included in the deployment via the `functions` configuration in `vercel.json`.

### Cold Starts

Serverless functions may experience "cold starts" (5-10 seconds) on first request after inactivity. Subsequent requests will be fast.

### File Size Limits

- Vercel serverless functions have a 50MB limit for the function code + dependencies
- If your `.pkl` files are very large, consider:
  - Using Vercel Pro plan (250MB limit)
  - Storing models in cloud storage (S3, Cloudflare R2) and loading them at runtime
  - Using a dedicated backend service (Railway, Render, Fly.io)

### NLTK Data

NLTK data is downloaded automatically on first function invocation. This may cause a slight delay on the first request.

## Testing Locally

To test the Vercel setup locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run Vercel dev server
vercel dev
```

This will simulate the Vercel environment locally.

## Troubleshooting

### Model files not found
- Ensure all `.pkl` files are in the `backend/` directory
- Check that `vercel.json` includes `"includeFiles": "backend/**"`

### Import errors
- Verify Python dependencies in `backend/requirements.txt`
- Check that `backend/api/index.py` correctly imports `backend_api`

### CORS errors
- The backend already has CORS middleware configured
- Ensure `NEXT_PUBLIC_API_URL` is set correctly in Vercel environment variables

### Function timeout
- Default timeout is 10 seconds (Hobby plan) or 60 seconds (Pro plan)
- If predictions take longer, consider optimizing the model or upgrading

## Updating After Deployment

Simply push changes to your repository. Vercel will automatically redeploy on every push to the main branch.

