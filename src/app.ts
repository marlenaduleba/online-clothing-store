import express from "express";
import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
// import { userRoutes } from './routes/userRoutes.js';
import productRoutes from "./routes/productRoutes.js";
// import { cartRoutes } from './routes/cartRoutes.js';
// import { orderRoutes } from './routes/orderRoutes.js';
// import { authenticateToken } from './middlewares/authenticateToken.js'; // Import middleware

const app = express();

// Logger
const logger = app.get("env") === "development" ? "dev" : "short";
app.use(morgan(logger));
app.use(cors());

// Middleware and other settings
app.use(express.json());

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

export default app;
