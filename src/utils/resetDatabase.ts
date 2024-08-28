import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, closeConnection } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Executes a SQL script from a file.
 *
 * @param filePath - The path to the SQL file to execute.
 *
 * @returns A promise that resolves when the script has been executed.
 */
const executeScript = async (filePath: string) => {
  try {
    const script = fs.readFileSync(filePath, 'utf-8');
    const queries = script.split(';').filter(query => query.trim() !== '');
    for (const queryText of queries) {
      await query(queryText);
    }
  } catch (err) {
    console.error('Error executing script', err);
  }
};

/**
 * Main function to reset the database by executing SQL scripts.
 *
 * This function drops existing tables, creates the schema, and inserts initial data.
 * It uses SQL scripts stored in the `database` directory.
 */
const main = async () => {
  try {
    const dropTablesScript = path.join(__dirname, '../../database/dropTables.sql');
    const schemaScript = path.join(__dirname, '../../database/schema.sql');
    const dataScript = path.join(__dirname, '../../database/initialData.sql');

    await executeScript(dropTablesScript);
    console.log('Dropping tables...');

    await executeScript(schemaScript);
    console.log('Creating schema...');

    await executeScript(dataScript);
    console.log('Inserting initial data...');

    console.log('Database reset successfully');
  } catch (err) {
    console.error('Error resetting the database', err);
  } finally {
    await closeConnection();
  }
};

// Run the main function to reset the database
main().catch(console.error);
