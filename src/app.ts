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

// Logger
const logger = app.get("env") === "development" ? "dev" : "short";
app.use(morgan(logger));
app.use(cors());

// Middleware for JSON requests
app.use(express.json());

// Use the logMessages middleware (it should be placed after JSON middleware)
app.use(logMessages);

// Public routes (no authentication required)
app.use("/api/v1/auth", authRoutes);

// Protected routes (authentication required)
app.use("/api/v1/products", authenticateToken, productRoutes);
app.use("/api/v1/users", authenticateToken, userRoutes);
app.use("/api/v1/account/carts", authenticateToken, cartRoutes);
app.use("/api/v1/account/orders", authenticateToken, orderRoutes);
app.use("/api/v1/admin/orders", authenticateToken, orderRoutes);

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
app.use(errorHandler);

export default app;
