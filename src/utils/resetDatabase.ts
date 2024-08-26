import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, closeConnection } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

main().catch(console.error);
