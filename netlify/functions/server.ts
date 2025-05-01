import serverless from 'serverless-http';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Basic route for testing
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'API is working!' });
});

// Import and use the main app routes
const initApp = async () => {
  try {
    const mainApp = await import('../../server/app');
    if (mainApp.default) {
      app.use(mainApp.default);
    } else {
      app.use(mainApp);
    }
  } catch (error) {
    console.error('Error loading main app:', error);
  }
};

// Initialize the app
initApp();

// Export the handler
export const handler = serverless(app, {
  binary: ['application/octet-stream', 'application/x-protobuf', 'image/*']
}); 