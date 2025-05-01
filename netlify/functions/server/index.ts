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
try {
  const mainApp = require('../../server/server');
  app.use(mainApp.default || mainApp);
} catch (error) {
  console.error('Failed to load server.ts:', error);
}

// Export handler
export const handler = serverless(app);
