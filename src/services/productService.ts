import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProducts } from '../models/productModel.js';

/**
 * Service to create a new product.
 *
 * @param productData - The data of the product to create.
 *
 * @returns The newly created product.
 */
export const createProductService = async (productData: any) => {
  return await createProduct(productData);
};

/**
 * Service to get all products.
 *
 * @returns An array of all products.
 */
export const getAllProductsService = async () => {
  return await getAllProducts();
};

/**
 * Service to get a product by its ID.
 *
 * @param id - The ID of the product to retrieve.
 *
 * @returns The product with the specified ID, or null if not found.
 */
export const getProductByIdService = async (id: number) => {
  return await getProductById(id);
};

/**
 * Service to update a product by its ID.
 *
 * @param id - The ID of the product to update.
 * @param productData - The new data for the product.
 *
 * @returns The updated product, or null if not found.
 */
export const updateProductService = async (id: number, productData: any) => {
  return await updateProduct(id, productData);
};

/**
 * Service to delete a product by its ID.
 *
 * @param id - The ID of the product to delete.
 *
 * @returns void
 */
export const deleteProductService = async (id: number) => {
  await deleteProduct(id);
};

/**
 * Service to search for products by a search term.
 *
 * @param searchTerm - The term to search for in the product name, brand, or category.
 *
 * @returns An array of products that match the search criteria.
 */
export const searchProductsService = async (searchTerm: string) => {
  return await searchProducts(searchTerm);
};
