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

/**
 * @route POST /register
 * @description Register a new user.
 * @access Public
 */
router.post("/register", validateRegister, register);

/**
 * @route POST /login
 * @description Log in a user.
 * @access Public
 */
router.post("/login", validateLogin, login);

/**
 * @route POST /logout
 * @description Log out a user.
 * @access Private (requires authentication)
 */
router.post("/logout", authenticateToken, logout);

/**
 * @route GET /me
 * @description Get the currently authenticated user's details.
 * @access Private (requires authentication)
 */
router.get("/me", authenticateToken, getCurrentUser);

/**
 * @route POST /refresh
 * @description Refresh the authentication token.
 * @access Public
 */
router.post("/refresh", refreshToken);

export default router;
