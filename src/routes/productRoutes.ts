import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../controllers/productController.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

/**
 * @route GET /api/v1/products/search
 * @description Search for products by name, brand, or category.
 * @access Public
 */
router.get("/search", searchProducts);

/**
 * @route GET /api/v1/products/{id}
 * @description Get a product by its ID.
 * @access Public
 */
router.get("/:id", getProductById);

/**
 * @route GET /api/v1/products
 * @description Get all products.
 * @access Public
 */
router.get("/", getAllProducts);

/**
 * @route POST /api/v1/admin/products
 * @description Create a new product (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.post("/", isAdmin, createProduct);

/**
 * @route PUT /api/v1/admin/products/{id}
 * @description Update a product by its ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.put("/:id", isAdmin, updateProduct);

/**
 * @route DELETE /api/v1/admin/products/{id}
 * @description Delete a product by its ID (Admin only).
 * @access Private (requires authentication and admin role)
 */
router.delete("/:id", isAdmin, deleteProduct);

export default router;
