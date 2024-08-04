import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

// Query function with restriction for T
export const query = <T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};
