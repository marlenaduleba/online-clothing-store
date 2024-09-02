
// jest.config.ts:
// export default {
//     preset: 'ts-jest',
//     testEnvironment: 'node',
//     setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Dodaj tę linię
//     // inne opcje konfiguracji...
//   };


// jest.setup.ts:
// import { query, connectToDatabase, closeConnection } from '../src/utils/db.js';
// import path from 'path';
// import fs from 'fs';

// /**
//  * Resets the database before all tests are run.
//  */
// const resetDatabase = async () => {
//   const dropTablesScript = path.join(__dirname, '../database/dropTables.sql');
//   const schemaScript = path.join(__dirname, '../database/migrations/01-schema.sql');
//   const dataScript = path.join(__dirname, '../database/migrations/02-initialData.sql');

//   // Execute the SQL scripts to reset the database
//   const executeScript = async (filePath: string) => {
//     const script = fs.readFileSync(filePath, 'utf-8');
//     const queries = script.split(';').filter(query => query.trim() !== '');
//     for (const queryText of queries) {
//       await query(queryText);
//     }
//   };

//   await executeScript(dropTablesScript);
//   await executeScript(schemaScript);
//   await executeScript(dataScript);
// };

// beforeAll(async () => {
//   await connectToDatabase(); // Establish database connection
//   await resetDatabase(); // Reset the database before running tests
// });

// afterAll(async () => {
//   await closeConnection(); // Close the database connection after all tests
// });

  