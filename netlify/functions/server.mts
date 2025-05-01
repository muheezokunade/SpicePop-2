import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
const initApp = async () => {
  try {
    const mainAppPath = resolve(__dirname, '../../../server/app.ts');
    const mainApp = await import(mainAppPath);
    app.use('/api', mainApp.default || mainApp);
  } catch (error) {
    console.error('Failed to load main application:', error);
    app.use('/api', (req, res) => {
      res.status(500).json({ error: 'Failed to load application' });
    });
  }
};

// Initialize the app
initApp();

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Create the serverless handler
const handler = serverless(app, {
  binary: [
    'application/octet-stream',
    'application/pdf',
    'image/*'
  ]
});

// Export the handler as default
export default handler; 