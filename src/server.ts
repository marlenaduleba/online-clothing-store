import app from "./app.js";
import { query } from "./utils/db.js";
import { QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Optional: Sample Database Query
  query("SELECT NOW()", [])
    .then((res: QueryResult) => {
      // We type the response as QueryResult
      console.log("Database connected:", res.rows[0]);
    })
    .catch((err: Error) => {
      // We type the error as Error
      console.error("Database connection error:", err.message);
    });
});
