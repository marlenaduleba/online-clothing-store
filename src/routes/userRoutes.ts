import { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { validateUserCreation, validateUserUpdate } from '../middlewares/validationMiddleware.js';

const router = Router();

/**
 * @route POST /admin/users
 * @description Create a new user (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.post('/admin/users', authenticateToken, isAdmin, validateUserCreation, createUser);

/**
 * @route GET /admin/users
 * @description Get all users (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.get('/admin/users', authenticateToken, isAdmin, getAllUsers);

/**
 * @route GET /admin/users/:id
 * @description Get a user by their ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.get('/admin/users/:id', authenticateToken, isAdmin, getUserById);

/**
 * @route PUT /admin/users/:id
 * @description Update a user by their ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.put('/admin/users/:id', authenticateToken, isAdmin, validateUserUpdate, updateUser);

/**
 * @route DELETE /admin/users/:id
 * @description Delete a user by their ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.delete('/admin/users/:id', authenticateToken, isAdmin, deleteUser);

export default router;
