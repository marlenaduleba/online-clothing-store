import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getCurrentUserOrders,
  getCurrentUserOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  validateCreateOrder,
  validateUpdateOrder,
} from "../middlewares/validationMiddleware.js";

const router = Router();

/**
 * @route POST /me/orders
 * @description Create a new order for the current user.
 * @access Private (requires authentication)
 */
router.post("/me/orders", authenticateToken, validateCreateOrder, createOrder);

/**
 * @route GET /admin/orders
 * @description Get all orders (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.get("/admin/orders", authenticateToken, isAdmin, getAllOrders);

/**
 * @route GET /admin/orders/:id
 * @description Get an order by its ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.get("/admin/orders/:id", authenticateToken, isAdmin, getOrderById);

/**
 * @route GET /me/orders
 * @description Get all orders of the current user.
 * @access Private (requires authentication)
 */
router.get("/me/orders", authenticateToken, getCurrentUserOrders);

/**
 * @route GET /me/orders/:id
 * @description Get a specific order of the current user by its ID.
 * @access Private (requires authentication)
 */
router.get("/me/orders/:id", authenticateToken, getCurrentUserOrderById);

/**
 * @route PUT /me/orders/:id
 * @description Update an order of the current user by its ID.
 * @access Private (requires authentication)
 */
router.put(
  "/me/orders/:id",
  authenticateToken,
  validateUpdateOrder,
  updateOrder
);

/**
 * @route DELETE /admin/orders/:id
 * @description Delete an order by its ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.delete("/admin/orders/:id", authenticateToken, isAdmin, deleteOrder);

export default router;
