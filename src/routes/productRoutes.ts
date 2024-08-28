import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProducts } from '../controllers/productController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = Router();

/**
 * @route POST /admin/products
 * @description Create a new product (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.post('/admin/products', authenticateToken, isAdmin, createProduct);

/**
 * @route GET /products
 * @description Get all products.
 * @access Public
 */
router.get('/products', getAllProducts);

/**
 * @route GET /products/:id
 * @description Get a product by its ID.
 * @access Public
 */
router.get('/products/:id', getProductById);

/**
 * @route GET /products/search
 * @description Search for products by name, brand, or category.
 * @access Public
 */
router.get('/products/search', searchProducts);

/**
 * @route PUT /admin/products/:id
 * @description Update a product by its ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.put('/admin/products/:id', authenticateToken, isAdmin, updateProduct);

/**
 * @route DELETE /admin/products/:id
 * @description Delete a product by its ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.delete('/admin/products/:id', authenticateToken, isAdmin, deleteProduct);

export default router;
