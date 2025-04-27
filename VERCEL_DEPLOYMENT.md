# Vercel Deployment Guide for SpicePop

This guide will help you deploy the SpicePop e-commerce platform to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. A [GitHub account](https://github.com/join) (for deploying from GitHub)
3. A [Neon Database](https://neon.tech) account (or another PostgreSQL provider)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to a GitHub repository. If you're working locally, initialize a Git repository and push to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/spicepop.git
git push -u origin main
```

### 2. Set Up the Database

If you don't already have a database set up:

1. Create a Neon account at [neon.tech](https://neon.tech)
2. Create a new project
3. Get your database connection string (it should look like `postgres://user:password@hostname:port/database`)

### 3. Deploy to Vercel

1. Log in to your Vercel account
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Add Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL database connection string
   - `NODE_ENV`: `production`

6. Click "Deploy"

### 4. Finalize the Deployment

1. After the initial deployment, go to the "Settings" tab
2. Under "General" → "Root Directory", verify it's set to `/`
3. Under "Build & Development Settings", make sure:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Development Command: `npm run dev`

4. Redeploy if needed by clicking "Redeploy" from the "Deployments" tab

## Troubleshooting

- **Database Connection Issues**: Make sure your `DATABASE_URL` environment variable is correctly set and accessible from Vercel's servers.
- **Build Failures**: Check the build logs for any errors. Most common issues are related to dependencies or environment variables.
- **API Routes Not Working**: Verify that your `vercel.json` file is correctly set up and that your API routes are properly configured.

## Post-Deployment

1. Set up a custom domain in Vercel's dashboard if desired
2. Configure any additional environment variables needed
3. Set up monitoring and analytics

## Notes

- Whenever you push changes to your GitHub repository, Vercel will automatically rebuild and redeploy your application.
- For production use, consider setting up automatic database backups.