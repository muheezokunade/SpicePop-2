import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../shared/schema.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Current environment variables:', {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV
});

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('Environment variable DATABASE_URL is missing. Check your .env file.');
}

// Create Neon connection
const sql = neon(DATABASE_URL);

// Create Drizzle instance
export const db = drizzle(sql, { schema });
