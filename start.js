import dotenv from 'dotenv';
dotenv.config();

console.log('Loaded SUPABASE_URL:', process.env.SUPABASE_URL); // <-- This MUST print your URL

import('./dist/index.js');
