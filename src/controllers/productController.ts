import { Request, Response, NextFunction } from 'express';
import { createProductService, getAllProductsService, getProductByIdService, updateProductService, deleteProductService, searchProductsService } from '../services/productService.js';

/**
 * Creates a new product.
 *
 * @param req - The request object containing the product details.
 * @param res - The response object to confirm the product was created.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the created product data.
 */
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all products.
 *
 * @param req - The request object.
 * @param res - The response object to send the list of products.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the list of all products.
 */
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getAllProductsService();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a specific product by its ID.
 *
 * @param req - The request object containing the product ID.
 * @param res - The response object to send the product data.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the product data, or an error message if the product is not found.
 */
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await getProductByIdService(parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a specific product by its ID.
 *
 * @param req - The request object containing the updated product details.
 * @param res - The response object to confirm the product was updated.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the updated product data, or an error message if the product is not found.
 */
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await updateProductService(parseInt(req.params.id), req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a specific product by its ID.
 *
 * @param req - The request object containing the product ID.
 * @param res - The response object to confirm the product was deleted.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with a message confirming the product was deleted.
 */
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteProductService(parseInt(req.params.id));
    res.status(200).json({ message: 'Product successfully deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * Searches for products based on a query parameter.
 *
 * @param req - The request object containing the search query parameter.
 * @param res - The response object to send the search results.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the list of products matching the search criteria, or an error message if the query parameter is missing.
 */
export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchTerm = req.query.q?.toString();
    if (!searchTerm) {
      return res.status(400).json({ message: 'Query parameter q is required' });
    }
    const products = await searchProductsService(searchTerm);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
