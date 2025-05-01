import serverless from 'serverless-http';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config();

const app = express();

// Simple test route
app.get('/api/test', (_req, res) => {
  res.json({ message: 'API is working!' });
});

// Import your main Express app
const initApp = async () => {
  try {
    const mainApp = await import('@server/app');
    app.use(mainApp.default || mainApp);
  } catch (error) {
    console.error('Failed to load app.ts:', error);
  }
};

// Initialize the app
initApp();

// Export handler
export const handler = serverless(app);
