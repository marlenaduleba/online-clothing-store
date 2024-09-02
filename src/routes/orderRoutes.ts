import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getCurrentUserOrders,
  getCurrentUserOrderById,
  deleteOrder,
} from "../controllers/orderController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { validateCreateOrder } from "../middlewares/validationMiddleware.js";

const router = Router();

/**
 * @route POST /api/v1/me/orders
 * @description Create a new order for the current user.
 * @access Private (requires authentication)
 */
router.post("/", validateCreateOrder, createOrder);

/**
 * @route GET /api/v1/admin/orders
 * @description Get all orders (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.get("/", isAdmin, getAllOrders);

/**
 * @route GET api/v1/admin/orders/:id
 * @description Get an order by its ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.get("/:id", isAdmin, getOrderById);

/**
 * @route GET api/v1/me/orders
 * @description Get all orders of the current user.
 * @access Private (requires authentication)
 */
router.get("/", getCurrentUserOrders);

/**
 * @route GET api/v1/me/orders/:id
 * @description Get a specific order of the current user by its ID.
 * @access Private (requires authentication)
 */
router.get("/:id", getCurrentUserOrderById);

/**
 * @route DELETE api/v1/admin/orders/:id
 * @description Delete an order by its ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.delete("/:id", isAdmin, deleteOrder);

export default router;
