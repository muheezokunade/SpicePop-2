const serverless = require('serverless-http');
const express = require('express');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Basic route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Import and use the main app routes
try {
  const mainApp = require('../../server/app');
  if (mainApp.default) {
    app.use(mainApp.default);
  } else {
    app.use(mainApp);
  }
} catch (error) {
  console.error('Error loading main app:', error);
}

// Export the handler
module.exports.handler = serverless(app, {
  binary: ['application/octet-stream', 'application/x-protobuf', 'image/*']
}); 