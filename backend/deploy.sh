#!/bin/bash

# Exit on error
set -e

# Colors for output
RED=""
GREEN=""
BLUE=""
NC="" # No Color

# Check if user is logged in to gcloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)"; then
    echo -e "${RED}Error: Not logged in to gcloud. Please run 'gcloud auth login' first.${NC}"
    exit 1
fi

# Check if project is set
if [ -z "$(gcloud config get-value project)" ]; then
    echo -e "${RED}Error: No project set. Please run 'gcloud config set project YOUR_PROJECT_ID' first.${NC}"
    exit 1
fi

# Build and deploy backend
echo -e "${BLUE}Deploying Backend...${NC}"

echo -e "${GREEN}Building backend container...${NC}"
gcloud builds submit . --tag gcr.io/$(gcloud config get-value project)/weekend-pacs-backend

echo -e "${GREEN}Deploying to Cloud Run...${NC}"
gcloud run deploy weekend-pacs-backend \
  --image gcr.io/$(gcloud config get-value project)/weekend-pacs-backend \
  --platform managed \
  --region europe-west6 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars FIREBASE_DATABASE_URL=https://weekend-pacs-default-rtdb.europe-west1.firebasedatabase.app/

echo -e "${GREEN}Backend deployment completed successfully!${NC}"

# Print Cloud Run URL
echo -e "\n${BLUE}Your backend is available at:${NC}"
gcloud run services describe weekend-pacs-backend \
  --platform managed \
  --region europe-west6 \
  --format="value(status.url)"