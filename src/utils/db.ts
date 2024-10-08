import pg, { QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a new Pool instance for database connection
const { Pool } = pg;
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
});

/**
 * Executes an SQL query against the database.
 *
 * @param text - The SQL query string.
 * @param params - Optional parameters to be passed with the query.
 *
 * @returns A promise that resolves to the query result.
 */
export const query = <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};

/**
 * Closes the connection to the database.
 *
 * @returns A promise that resolves when the connection is closed.
 */
export const closeConnection = async () => {
  await pool.end();
};
