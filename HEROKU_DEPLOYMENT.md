# Deploying Backend to Heroku

This guide explains how to deploy the FastAPI backend to Heroku.

## Prerequisites

- A Heroku account (sign up at [heroku.com](https://www.heroku.com))
- Heroku CLI installed: [Install Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Git installed

## Project Structure

```
FakeJob/
├── backend/
│   ├── backend_api.py      # FastAPI application
│   ├── *.pkl                # ML model files
│   ├── requirements.txt     # Python dependencies
│   ├── runtime.txt          # Python version
│   └── Procfile             # Heroku process file (alternative)
├── Procfile                 # Heroku process file (root level)
└── .gitignore
```

## Deployment Steps

### Option 1: Deploy via Heroku CLI (Recommended)

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create a Heroku App**
   ```bash
   heroku create your-app-name
   ```
   (Replace `your-app-name` with your desired app name, or leave blank for auto-generated name)

3. **Set Python Buildpack**
   ```bash
   heroku buildpacks:set heroku/python
   ```

4. **Deploy to Heroku**
   ```bash
   git add .
   git commit -m "Prepare for Heroku deployment"
   git push heroku main
   ```
   (Use `master` instead of `main` if your default branch is `master`)

5. **Open Your App**
   ```bash
   heroku open
   ```

### Option 2: Deploy via Heroku Dashboard

1. **Connect GitHub Repository**
   - Go to [Heroku Dashboard](https://dashboard.heroku.com)
   - Click "New" → "Create new app"
   - Enter app name and region
   - Go to "Deploy" tab
   - Connect your GitHub repository
   - Enable automatic deploys (optional)
   - Click "Deploy Branch"

2. **Set Buildpack**
   - Go to "Settings" tab
   - Under "Buildpacks", click "Add buildpack"
   - Select "python"

## Important Configuration

### Environment Variables

Set any required environment variables:
```bash
heroku config:set VARIABLE_NAME=value
```

For CORS, the backend already allows all origins (`*`). For production, you may want to restrict this:
```bash
heroku config:set ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Model Files

The `.pkl` model files must be committed to your Git repository for Heroku to include them. Make sure they're not in `.gitignore`.

### NLTK Data

NLTK data is downloaded automatically on first startup. This may cause a slight delay on the first request.

## Verifying Deployment

1. **Check Logs**
   ```bash
   heroku logs --tail
   ```

2. **Test Health Endpoint**
   ```bash
   curl https://your-app-name.herokuapp.com/health
   ```

3. **Test Prediction Endpoint**
   ```bash
   curl -X POST https://your-app-name.herokuapp.com/predict \
     -H "Content-Type: application/json" \
     -d '{"title":"Software Engineer","description":"We are looking for...","company_profile":"Tech company"}'
   ```

## API Endpoints

After deployment, your API will be available at:
- `https://your-app-name.herokuapp.com/` - Root endpoint
- `https://your-app-name.herokuapp.com/docs` - Interactive API documentation (Swagger UI)
- `https://your-app-name.herokuapp.com/health` - Health check
- `https://your-app-name.herokuapp.com/predict` - Prediction endpoint (POST)

## Updating Frontend

Update your frontend's API URL to point to your Heroku backend:

1. **Set Environment Variable** (for Next.js)
   ```bash
   # In your frontend directory
   echo "NEXT_PUBLIC_API_URL=https://your-app-name.herokuapp.com" > .env.local
   ```

2. **Or update directly in code** (if not using env vars)
   Change the fetch URL in `frontend/src/app/page.tsx` to:
   ```typescript
   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://your-app-name.herokuapp.com'
   ```

## Troubleshooting

### Model Files Not Found
- Ensure `.pkl` files are committed to Git (not in `.gitignore`)
- Check that files are in the `backend/` directory
- Verify with: `git ls-files backend/*.pkl`

### Build Fails
- Check Python version in `runtime.txt` matches Heroku's supported versions
- Verify all dependencies in `requirements.txt` are correct
- Check build logs: `heroku logs --tail`

### App Crashes
- Check logs: `heroku logs --tail`
- Verify Procfile syntax is correct
- Ensure PORT environment variable is used (handled by gunicorn)

### Timeout Issues
- Increase timeout in Procfile: `--timeout 300`
- Check if model loading takes too long
- Consider using Heroku's Performance-L dyno for faster startup

### NLTK Data Download Issues
- NLTK downloads happen automatically on first request
- If issues occur, you can pre-download in a build script

## Scaling

### Dyno Types
- **Free/Hobby**: Good for testing, but has limitations
- **Standard**: Recommended for production ($7/month per dyno)
- **Performance**: For high-traffic applications

### Scale Dynos
```bash
heroku ps:scale web=1
```

## Cost Considerations

- **Free Tier**: No longer available (as of Nov 2022)
- **Eco Dyno**: $5/month (sleeps after 30 min inactivity)
- **Basic Dyno**: $7/month (always on)
- **Standard Dyno**: $25/month (better performance)

## Additional Resources

- [Heroku Python Support](https://devcenter.heroku.com/articles/python-support)
- [FastAPI on Heroku](https://fastapi.tiangolo.com/deployment/)
- [Heroku CLI Commands](https://devcenter.heroku.com/articles/heroku-cli-commands)

