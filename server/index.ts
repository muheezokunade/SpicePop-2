import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app';

// Handle paths in both serverless and local environments
let __dirname = '.';
try {
  __dirname = path.dirname(fileURLToPath(import.meta.url));
} catch (error) {
  console.warn('Unable to determine dirname, falling back to current directory');
}

// Load environment variables from the appropriate location
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log("Loaded DB URL:", process.env.DATABASE_URL?.split('@')[1]); // Only log the host part for security

export { app };

// Only start the server if this file is run directly (not in serverless)
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
