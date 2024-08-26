import { Router } from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProducts } from '../controllers/productController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = Router();

router.post('/admin/products', authenticateToken, isAdmin, createProduct);  // Create Product (Admin Only)
router.get('/products', getAllProducts);                                   // Get All Products
router.get('/products/:id', getProductById);                               // Get Product by ID
router.get('/products/search', searchProducts);                            // Search Products
router.put('/admin/products/:id', authenticateToken, isAdmin, updateProduct); // Update Product by ID (Admin Only)
router.delete('/admin/products/:id', authenticateToken, isAdmin, deleteProduct); // Delete Product by ID (Admin Only)

export default router;
