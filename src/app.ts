import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";
import chalk from "chalk";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { logMessages } from "./middlewares/logMessages.js";

const app = express();

// Logger
const logger = app.get("env") === "development" ? "dev" : "short";
app.use(morgan(logger));
app.use(cors());

// Middleware for JSON requests
app.use(express.json());

// Use the logMessages middleware (it should be placed after JSON middleware)
app.use(logMessages);

// Public routes (no authentication required)
app.use("/api/v1", authRoutes);
app.use("/api/v1", productRoutes);

// Root route
app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Welcome to the Online Clothing Store API");
});

// Middleware for handling 404 errors (not found)
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not Found");
  res.status(404);
  next(error); // Pass the error to the global error handler
});

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(chalk.red(err.message || 'An unknown error occurred'));
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
