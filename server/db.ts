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

// Additional connection options to handle control plane issues
const CONNECTION_RETRIES = 5;
const RETRY_DELAY_MS = 1000;

// Helper function for exponential backoff
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create Neon connection with robust error handling
let sql: NeonQueryFunction<false, false> = neon('postgresql://dummy:dummy@dummy.neon.tech/dummy'); // Default initialization
let connectionStatus = 'pending';

// Initialize connection with retries
const initializeConnection = async () => {
  for (let attempt = 0; attempt < CONNECTION_RETRIES; attempt++) {
    try {
      console.log(`Database connection attempt ${attempt + 1}/${CONNECTION_RETRIES}...`);
      
      // Create the SQL connection
      sql = neon(DATABASE_URL, { 
        // Add fetch options to handle control plane issues
        fetchOptions: {
          keepalive: true,
          cache: 'no-store'
        }
      });
      
      // Test the connection
      const result = await sql`SELECT 1 as ping`;
      console.log('Database connection successful:', result[0].ping === 1 ? 'OK' : 'FAIL');
      connectionStatus = 'connected';
      return;
    } catch (err) {
      console.error(`Database connection attempt ${attempt + 1} failed:`, err);
      
      if (attempt < CONNECTION_RETRIES - 1) {
        // Calculate backoff delay with jitter
        const jitter = Math.random() * 500;
        const delayMs = (RETRY_DELAY_MS * Math.pow(1.5, attempt)) + jitter;
        console.log(`Retrying in ${Math.floor(delayMs)}ms...`);
        await sleep(delayMs);
      } else {
        console.error('All connection attempts failed. Using fallback connection.');
        connectionStatus = 'failed';
      }
    }
  }

  // If all attempts fail, create a dummy connection that will fail gracefully
  sql = neon('postgresql://dummy:dummy@dummy.neon.tech/dummy');
};

// Start initialization process
initializeConnection().catch(err => {
  console.error('Connection initialization process failed:', err);
  // Create a dummy connection if initialization process itself fails
  sql = neon('postgresql://dummy:dummy@dummy.neon.tech/dummy');
  connectionStatus = 'failed';
});

// Create Drizzle instance with additional options
export const db = drizzle(sql, { 
  schema,
  // Add a PreparedStatementCache to reduce prepared statement issues
  logger: process.env.NODE_ENV === 'development'
});

// Export connection status for health checks
export const getDatabaseStatus = () => connectionStatus;
