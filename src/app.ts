import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
// import { userRoutes } from './routes/userRoutes.js';
import productRoutes from "./routes/productRoutes.js";
// import { cartRoutes } from './routes/cartRoutes.js';
// import { orderRoutes } from './routes/orderRoutes.js';
// import { authenticateToken } from './middlewares/authenticateToken.js'; // Import middleware
import { logMessages } from "./middlewares/logMessages.js";

const app = express();

// Logger
const logger = app.get("env") === "development" ? "dev" : "short";
app.use(morgan(logger));
app.use(cors());

// Middleware and other settings
app.use(express.json());

// Use the logMessages middleware
app.use(logMessages);

// Public routes (no authentication required)
app.use("/api/v1", authRoutes);
app.use("/api/v1", productRoutes);

// Protected routes (authentication required)
// app.use(authenticateToken); // Middleware for all routes below

// app.use('/api/v1', userRoutes);
// app.use('/api/v1', cartRoutes);
// app.use('/api/v1', orderRoutes);

// Root route
app.get("/api/v1", (req, res) => {
  res.send("Welcome to the Online Clothing Store API");
});

// Error handling middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Not Found");
    res.status(404);
    next(error);
  });
  
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(res.statusCode || 500);
    res.json({
      message: error.message,
      stack: app.get("env") === "development" ? error.stack : {}
    });
  });

export default app;
