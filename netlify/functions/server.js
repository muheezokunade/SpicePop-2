const serverless = require('serverless-http');
const express = require('express');
const app = require('../../server/app');

// Create the serverless handler
const handler = serverless(app, {
  binary: ['application/octet-stream', 'application/x-protobuf', 'image/*']
});

// Export the handler
exports.handler = async (event, context) => {
  // Make context available to underlying Express app
  event.requestContext = event.requestContext || {};
  event.requestContext.authorizer = event.requestContext.authorizer || {};
  
  return handler(event, context);
}; 