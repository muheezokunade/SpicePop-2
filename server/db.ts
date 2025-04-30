import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Create Postgres connection for Drizzle
const connectionString = `postgres://postgres.iyrpcjtxdhgvbrizpzir:${process.env.SUPABASE_DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:5432/postgres?sslmode=require`;

const client = postgres(connectionString, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
  connection: {
    application_name: 'spicepop'
  }
});

export const db = drizzle(client, { schema });
