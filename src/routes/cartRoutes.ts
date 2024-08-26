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
  "/me/cart",
  authenticateToken,
  validateAddItemToCart,
  addItemToCart
);

// Endpoint: Get Current User's Cart
router.get("/me/cart", authenticateToken, getCurrentUserCart);

// Endpoint: Update Cart Item
router.put(
  "/me/cart",
  authenticateToken,
  validateUpdateCartItem,
  updateCartItem
);

// Endpoint: Clear Cart
router.delete("/me/cart", authenticateToken, clearCart);

export default router;
