import serverless from 'serverless-http';
import express from 'express';
import app from '../../server/app';

// Create the serverless handler
const serverlessHandler = serverless(app, {
  binary: ['application/octet-stream', 'application/x-protobuf', 'image/*']
});

// Export the handler
export const handler = async (event, context) => {
  // Make context available to underlying Express app
  event.requestContext = event.requestContext || {};
  event.requestContext.authorizer = event.requestContext.authorizer || {};
  
  return serverlessHandler(event, context);
}; 