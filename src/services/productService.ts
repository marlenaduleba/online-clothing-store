import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProducts } from '../models/productModel.js';

export const createProductService = async (productData: any) => {
  return await createProduct(productData);
};

export const getAllProductsService = async () => {
  return await getAllProducts();
};

export const getProductByIdService = async (id: number) => {
  return await getProductById(id);
};

export const updateProductService = async (id: number, productData: any) => {
  return await updateProduct(id, productData);
};

export const deleteProductService = async (id: number) => {
  await deleteProduct(id);
};

export const searchProductsService = async (searchTerm: string) => {
  return await searchProducts(searchTerm);
};
