import serverless from 'serverless-http';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Simple test route
app.get('/api/test', (_req, res) => {
  res.json({ message: 'API is working!' });
});

// Import your main Express app
const initApp = async () => {
  try {
    const mainApp = await import('@server/app');
    const appModule = mainApp.default || mainApp;
    
    // Mount the app at /api
    app.use('/api', appModule);
    
    // Error handling
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Error:', err);
      res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
      });
    });
  } catch (error) {
    console.error('Failed to load app.ts:', error);
  }
};

// Initialize the app
initApp();

// Export handler
export const handler = serverless(app, {
  binary: [
    'application/octet-stream',
    'image/*',
    'application/pdf'
  ]
});
