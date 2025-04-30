import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://iyrpcjtxdhgvbrizpzir.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cnBjanR4ZGhndmJyaXpwemlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MzkzMDMsImV4cCI6MjA2MTQxNTMwM30.lwZ5a_rGXyH4HQXwDqMwR-VL0lnzkGCmVx829Unt6iw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const { data, error } = await supabase.from('users').select('*').limit(1);

  if (error) {
    console.error('Error querying Supabase:', error);
  } else {
    console.log('Supabase connection successful! Sample data:', data);
  }
}

testConnection(); 