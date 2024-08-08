import { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { validateUserCreation, validateUserUpdate } from '../middlewares/validationMiddleware.js';

const router = Router();

// Endpoint: Create User (Admin Only)
router.post('/admin/users', authenticateToken, isAdmin, validateUserCreation, createUser);

// Endpoint: Get All Users (Admin Only)
router.get('/admin/users', authenticateToken, isAdmin, getAllUsers);

// Endpoint: Get User by ID (Admin Only)
router.get('/admin/users/:id', authenticateToken, isAdmin, getUserById);

// Endpoint: Update User by ID (Admin Only)
router.put('/admin/users/:id', authenticateToken, isAdmin, validateUserUpdate, updateUser);

// Endpoint: Delete User by ID (Admin Only)
router.delete('/admin/users/:id', authenticateToken, isAdmin, deleteUser);

export default router;
