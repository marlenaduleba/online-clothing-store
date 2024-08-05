import pg, { QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a new Pool instance for database connection
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Log when the connection to the database is established
pool.on('connect', () => {
  console.log('Connected to the database');
});

// Function to execute SQL queries
export const query = <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};

// Function to close the database connection
export const closeConnection = async () => {
  await pool.end();
};
