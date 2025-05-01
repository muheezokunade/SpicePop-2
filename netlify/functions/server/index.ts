import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic middleware
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

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Import and mount the main application
try {
  const mainAppPath = path.resolve(__dirname, '../../../server/app.ts');
  const mainApp = await import(mainAppPath);
  app.use('/api', mainApp.default || mainApp);
} catch (error) {
  console.error('Failed to load main application:', error);
  app.use('/api', (req, res) => {
    res.status(500).json({ error: 'Failed to load application' });
  });
}

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Export the serverless handler
export const handler = serverless(app, {
  binary: [
    'application/octet-stream',
    'application/pdf',
    'image/*'
  ]
});
