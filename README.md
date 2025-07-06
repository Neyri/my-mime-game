# Weekend PACS

A project.

## Frontend

### Setup

Navigate to the `frontend` directory and run the following commands:

```bash
npm install
npm run dev
```

### Deployment

From the `frontend` directory, run the deployment script:

```bash
sh deploy.sh
```

## Backend

### Setup

Navigate to the `backend` directory and run the following commands:

```bash
npm install
npm run dev
```

For a production-like local environment, you can use the `run_local.sh` script from the `backend` directory.

### Firebase Configuration

To connect to Firebase, you'll need to set up your service account credentials. 

1. Copy the example service account file:
```bash
cp backend/src/service-account.example.json backend/src/service-account.json
```

2. Replace the placeholder values in `backend/src/service-account.json` with your actual Firebase project credentials.

### Deployment

From the `backend` directory, run the deployment script. Ensure you are authenticated with `gcloud` and have a project configured.

```bash
sh deploy.sh
```

## Disclaimer

This project was vibe coded.
