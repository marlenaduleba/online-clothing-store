import { Router } from 'express';
import { createOrder, getAllOrders, getOrderById, getCurrentUserOrders, getCurrentUserOrderById, updateOrder, deleteOrder } from '../controllers/orderController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { validateCreateOrder, validateUpdateOrder } from '../middlewares/validationMiddleware.js';

const router = Router();

// Endpoint: Create Order
router.post('/account/orders', authenticateToken, validateCreateOrder, createOrder);

// Endpoint: Get All Orders (Admin Only)
router.get('/admin/orders', authenticateToken, isAdmin, getAllOrders);

// Endpoint: Get Order by ID (Admin Only)
router.get('/admin/orders/:id', authenticateToken, isAdmin, getOrderById);

// Endpoint: Get Current User's Orders
router.get('/account/orders', authenticateToken, getCurrentUserOrders);

// Endpoint: Get Current User's Order by ID
router.get('/account/orders/:id', authenticateToken, getCurrentUserOrderById);

// Endpoint: Update Order
router.put('/account/orders/:id', authenticateToken, validateUpdateOrder, updateOrder);

// Endpoint: Delete Order by ID (Admin Only)
router.delete('/admin/orders/:id', authenticateToken, isAdmin, deleteOrder);

export default router;
