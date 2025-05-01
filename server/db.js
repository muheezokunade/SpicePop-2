const { drizzle } = require('drizzle-orm/neon-serverless');
const { Pool } = require('@neondatabase/serverless');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create Drizzle instance
const db = drizzle(pool);

module.exports = { db, pool }; 