import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../shared/schema.js';
import dotenv from 'dotenv';
import type { NeonQueryFunction } from '@neondatabase/serverless';

// Load environment variables
dotenv.config();

console.log('Current environment variables:', {
  DATABASE_URL: process.env.DATABASE_URL?.replace(/^postgres.*@/, 'postgresql://*****@'),
  NODE_ENV: process.env.NODE_ENV
});

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('Environment variable DATABASE_URL is missing. Check your .env file.');
}

// Extract just the host from the connection string for logging
const dbHostMatch = DATABASE_URL.match(/@([^:]+)/);
const dbHost = dbHostMatch ? dbHostMatch[1] : 'unknown-host';
console.log(`Loaded DB URL: ${dbHost}`);

// Create Neon connection with error handling
let sql: NeonQueryFunction<false, false>;
try {
  sql = neon(DATABASE_URL);
  
  // Test the connection
  (async () => {
    try {
      const result = await sql`SELECT 1 as ping`;
      console.log('Database connection successful:', result[0].ping === 1 ? 'OK' : 'FAIL');
    } catch (err) {
      console.error('Database connection test failed:', err);
    }
  })();
} catch (error) {
  console.error('Failed to create database connection:', error);
  // Create a dummy implementation that will throw errors
  sql = neon('postgresql://dummy:dummy@dummy.neon.tech/dummy');
}

// Create Drizzle instance
export const db = drizzle(sql, { schema });
