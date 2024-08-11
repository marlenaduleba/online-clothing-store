import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
} from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validationMiddleware.js";

const router = Router();

// Endpoint: User Registration
router.post("/register", validateRegister, register);

// Endpoint: User Login
router.post("/login", validateLogin, login);

// Endpoint: User Logout
router.post("/logout", authenticateToken, logout);

// Endpoint: Get Current User
router.get("/current", authenticateToken, getCurrentUser);

// Endpoint: Refresh Token
router.post("/refresh", refreshToken);

export default router;
