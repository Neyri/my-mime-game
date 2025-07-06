#!/bin/bash

# Clean previous build
rm -rf dist

# Build frontend
echo "Building frontend..."

# Install dependencies
npm install

# Build the app
npm run build

# Deploy to App Engine
echo "Deploying frontend..."
gcloud app deploy frontend.yaml --version=$(date +%Y%m%d%H%M%S) -q

echo "Deployment complete!"
