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

/**
 * @route POST /me/cart
 * @description Add an item to the current user's cart.
 * @access Private (requires authentication)
 */
router.post(
  "/me/cart",
  authenticateToken,
  validateAddItemToCart,
  addItemToCart
);

/**
 * @route GET /me/cart
 * @description Get the current user's cart.
 * @access Private (requires authentication)
 */
router.get("/me/cart", authenticateToken, getCurrentUserCart);

/**
 * @route PUT /me/cart
 * @description Update an item in the current user's cart.
 * @access Private (requires authentication)
 */
router.put(
  "/me/cart",
  authenticateToken,
  validateUpdateCartItem,
  updateCartItem
);

/**
 * @route DELETE /me/cart
 * @description Clear the current user's cart.
 * @access Private (requires authentication)
 */
router.delete("/me/cart", authenticateToken, clearCart);

export default router;
