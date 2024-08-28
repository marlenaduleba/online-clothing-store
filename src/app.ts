import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { logMessages } from "./middlewares/logMessages.js";
import { authenticateToken } from "./middlewares/authenticateToken.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

/**
 * Logger middleware setup.
 * Uses 'dev' logging level in development, 'short' in production.
 */
const logger = app.get("env") === "development" ? "dev" : "short";
app.use(morgan(logger));
app.use(cors());

/**
 * Middleware for parsing JSON requests.
 */
app.use(express.json());

/**
 * Custom middleware for logging messages.
 * Should be placed after the JSON middleware to log response bodies.
 */
app.use(logMessages);

/**
 * Public routes that do not require authentication.
 */
app.use("/api/v1/auth", authRoutes);

/**
 * Protected routes that require authentication.
 */
app.use("/api/v1/products", authenticateToken, productRoutes);
app.use("/api/v1/users", authenticateToken, userRoutes);
app.use("/api/v1/me/cart", authenticateToken, cartRoutes);
app.use("/api/v1/me/orders", authenticateToken, orderRoutes);
app.use("/api/v1/admin/orders", authenticateToken, orderRoutes);

/**
 * Root route of the API.
 */
app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Welcome to the Online Clothing Store API");
});

/**
 * Middleware for handling 404 errors (resource not found).
 * Passes the error to the global error handler.
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not Found");
  res.status(404);
  next(error); // Pass the error to the global error handler
});

/**
 * Global error handling middleware.
 * Catches and processes errors that occur during request handling.
 */
app.use(errorHandler);

export default app;
