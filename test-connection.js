import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    console.log('Using connection string:', process.env.DATABASE_URL);
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    
    // Test a simple query
    const result = await client.query('SELECT current_database(), current_user');
    console.log('Database info:', result.rows[0]);
    
    await client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
    console.error('Error details:', err.message);
    if (err.code === 'ETIMEDOUT') {
      console.error('Connection timed out. This might be due to:');
      console.error('1. Network connectivity issues');
      console.error('2. Firewall blocking the connection');
      console.error('3. VPN interference');
    }
  } finally {
    await pool.end();
  }
}

testConnection(); 