# Deployment Guide

This guide will help you deploy the All in One Content Collector to Railway.

## Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- Git installed locally

## Step 1: Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/AllinOne.git
git push -u origin main
```

## Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

## Step 3: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create the database

## Step 4: Create Backend Service

1. Click "New" → "GitHub Repo"
2. Select your repository
3. Configure the service:
   - **Name**: Backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

4. Add environment variables:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = (Reference from PostgreSQL service)
   - `CORS_ORIGIN` = (Will be set after frontend is deployed)

## Step 5: Create Frontend Service

1. Click "New" → "GitHub Repo"
2. Select your repository again
3. Configure the service:
   - **Name**: Frontend
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

4. Add environment variables:
   - `VITE_API_URL` = (Backend service URL from step 4)

## Step 6: Generate Domains

1. Go to Backend service → Settings → Domains
2. Click "Generate Domain"
3. Copy the URL (e.g., `https://backend-production-xxxx.up.railway.app`)

4. Go to Frontend service → Settings → Domains
5. Click "Generate Domain"
6. Copy the URL (e.g., `https://frontend-production-xxxx.up.railway.app`)

## Step 7: Update Environment Variables

1. Go to Backend service → Variables
2. Update `CORS_ORIGIN` with your frontend URL

3. Go to Frontend service → Variables
4. Update `VITE_API_URL` with your backend URL

5. Redeploy both services

## Step 8: Verify Deployment

1. Visit your frontend URL
2. Try creating a folder
3. Try pasting a link
4. Check that everything works!

## Troubleshooting

### Backend shows "Application failed to respond"
- Check deployment logs
- Verify `DATABASE_URL` is set correctly
- Ensure migrations ran successfully

### Frontend shows "Application failed to respond"
- Check that `dist` folder was created during build
- Verify `server.js` exists in frontend directory
- Check deployment logs for errors

### Database connection errors
- Verify `DATABASE_URL` environment variable
- Check that PostgreSQL service is running
- Ensure migrations completed successfully

### CORS errors
- Verify `CORS_ORIGIN` matches your frontend URL exactly
- Include `https://` in the URL
- Redeploy backend after changing CORS_ORIGIN

## Environment Variables Reference

### Backend
- `NODE_ENV`: Set to `production`
- `PORT`: Automatically set by Railway
- `DATABASE_URL`: Reference from PostgreSQL service
- `CORS_ORIGIN`: Your frontend URL (e.g., `https://frontend-production-xxxx.up.railway.app`)

### Frontend
- `VITE_API_URL`: Your backend URL (e.g., `https://backend-production-xxxx.up.railway.app`)

## Updating Your Deployment

When you push changes to GitHub, Railway will automatically redeploy:

```bash
git add .
git commit -m "Your changes"
git push
```

Both services will rebuild and redeploy automatically.

## Cost Estimation

Railway offers:
- $5 free credit per month
- Pay-as-you-go after free credit
- Typical usage: $5-10/month for small projects

## Support

If you encounter issues:
1. Check Railway deployment logs
2. Review this guide
3. Check the main [README.md](../README.md)
4. Open an issue on GitHub
