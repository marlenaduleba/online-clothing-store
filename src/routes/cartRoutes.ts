import { Router } from 'express';
import { addItemToCart, getCurrentUserCart, updateCartItem, clearCart } from '../controllers/cartController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { validateAddItemToCart, validateUpdateCartItem } from '../middlewares/validationMiddleware.js';

const router = Router();

// Endpoint: Add Item to Cart
router.post('/account/carts', authenticateToken, validateAddItemToCart, addItemToCart);

// Endpoint: Get Current User's Cart
router.get('/account/carts', authenticateToken, getCurrentUserCart);

// Endpoint: Update Cart Item
router.put('/account/carts', authenticateToken, validateUpdateCartItem, updateCartItem);

// Endpoint: Clear Cart
router.delete('/account/carts', authenticateToken, clearCart);

export default router;
