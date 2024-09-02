import { NextFunction, Request, Response, Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  validateUserCreation,
  validateUserUpdate,
} from "../middlewares/validationMiddleware.js";

const router = Router();

/**
 * @route POST /api/v1/admin/users
 * @description Create a new user (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.post(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Received request to create user:", req.body);
    next();
  },
  isAdmin,
  validateUserCreation,
  createUser
);

/**
 * @route GET /api/v1/admin/users
 * @description Get all users (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.get("/", isAdmin, getAllUsers);

/**
 * @route GET /api/v1/admin/users/:id
 * @description Get a user by their ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.get("/:id", isAdmin, getUserById);

/**
 * @route PUT /api/v1/admin/users/:id
 * @description Update a user by their ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.put("/:id", isAdmin, validateUserUpdate, updateUser);

/**
 * @route DELETE /api/v1/admin/users/:id
 * @description Delete a user by their ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.delete("/:id", isAdmin, deleteUser);

export default router;
