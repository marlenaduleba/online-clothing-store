import { Router } from "express";
import {
  addItemToCart,
  getCurrentUserCart,
  updateCartItem,
  clearCart,
} from "../controllers/cartController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  validateAddItemToCart,
  validateUpdateCartItem,
} from "../middlewares/validationMiddleware.js";

const router = Router();

// Endpoint: Add Item to Cart
router.post(
  "/current/carts",
  authenticateToken,
  validateAddItemToCart,
  addItemToCart
);

// Endpoint: Get Current User's Cart
router.get("/current/carts", authenticateToken, getCurrentUserCart);

// Endpoint: Update Cart Item
router.put(
  "/current/carts",
  authenticateToken,
  validateUpdateCartItem,
  updateCartItem
);

// Endpoint: Clear Cart
router.delete("/current/carts", authenticateToken, clearCart);

export default router;
