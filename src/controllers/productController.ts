import { Request, Response, NextFunction } from 'express';
import { createProductService, getAllProductsService, getProductByIdService, updateProductService, deleteProductService, searchProductsService } from '../services/productService.js';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await getAllProductsService();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

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

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteProductService(parseInt(req.params.id));
    res.status(200).json({ message: 'Product successfully deleted' });
  } catch (error) {
    next(error);
  }
};

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