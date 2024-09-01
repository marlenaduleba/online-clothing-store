import app from "./app.js";
import { query } from "./utils/db.js";
import { QueryResult } from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Starts the Express server and optionally performs a sample database query
 * to confirm the database connection.
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Optional: Sample Database Query to check connection
  query("SELECT NOW()", [])
    .then((res: QueryResult) => {
      console.log("Database connected:", res.rows[0]);
    })
    .catch((err: Error) => {
      // We type the error as Error
      console.error("Database connection error:", err.message);
      process.exit(1);
    });
});
