export const isProduction = process.env.NODE_ENV === 'production';

export const API_URL = isProduction 
  ? 'https://weekend-pacs-backend-548935618871.europe-west6.run.app/api'
  : 'http://localhost:8080/api';
