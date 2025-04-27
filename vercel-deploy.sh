#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Vercel deployment preparation..."

# Build the app
echo "📦 Building the application..."
npm run build

echo "✅ Build completed!"
echo ""
echo "====================================================="
echo "🔍 Vercel Deployment Instructions:"
echo "====================================================="
echo ""
echo "1. Create a Vercel account if you don't have one"
echo "2. Install Vercel CLI: 'npm install -g vercel'"
echo "3. Login to Vercel: 'vercel login'"
echo "4. Deploy with: 'vercel --prod'"
echo ""
echo "Make sure to add your DATABASE_URL as an environment variable in Vercel dashboard."
echo "====================================================="
echo ""
echo "For more detailed instructions, please read the VERCEL_DEPLOYMENT.md file."