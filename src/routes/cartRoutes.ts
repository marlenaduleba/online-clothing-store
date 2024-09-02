import { Router } from "express";
import {
  addItemToCart,
  getCurrentUserCart,
  updateCartItem,
  clearCart,
} from "../controllers/cartController.js";
import {
  validateAddItemToCart,
  validateUpdateCartItem,
} from "../middlewares/validationMiddleware.js";

const router = Router();

/**
 * @route POST /api/v1/me/cart
 * @description Add an item to the current user's cart.
 * @access Private (requires authentication)
 */
router.post("/", validateAddItemToCart, addItemToCart);

/**
 * @route GET /api/v1/me/cart
 * @description Get the current user's cart.
 * @access Private (requires authentication)
 */
router.get("/", getCurrentUserCart);

/**
 * @route PUT /api/v1/me/cart
 * @description Update an item in the current user's cart.
 * @access Private (requires authentication)
 */
router.put("/", validateUpdateCartItem, updateCartItem);

/**
 * @route DELETE /api/v1/me/cart
 * @description Clear the current user's cart.
 * @access Private (requires authentication)
 */
router.delete("/", clearCart);

export default router;
