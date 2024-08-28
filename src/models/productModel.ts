import { query } from '../utils/db.js';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  size: string;
}

/**
 * Creates a new product.
 *
 * @param productData - The data of the product to create, excluding the ID.
 *
 * @returns The newly created product.
 */
export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  const { name, description, price, brand, category, size } = productData;
  const result = await query<Product>(
    'INSERT INTO products (name, description, price, brand, category, size) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, description, price, brand, category, size]
  );
  return result.rows[0];
};

/**
 * Retrieves all products.
 *
 * @returns An array of all products.
 */
export const getAllProducts = async (): Promise<Product[]> => {
  const result = await query<Product>('SELECT * FROM products');
  return result.rows;
};

/**
 * Retrieves a product by its ID.
 *
 * @param id - The ID of the product to retrieve.
 *
 * @returns The product with the specified ID, or null if not found.
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  const result = await query<Product>('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0] || null;
};

/**
 * Updates a product by its ID.
 *
 * @param id - The ID of the product to update.
 * @param productData - The new data for the product.
 *
 * @returns The updated product, or null if not found.
 */
export const updateProduct = async (id: number, productData: Partial<Product>): Promise<Product | null> => {
  const fields = Object.keys(productData).filter((key) => productData[key as keyof Product] !== undefined);
  const values = fields.map((key) => productData[key as keyof Product]);
  const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
  const result = await query<Product>(
    `UPDATE products SET ${setString} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );
  return result.rows[0] || null;
};

/**
 * Deletes a product by its ID.
 *
 * @param id - The ID of the product to delete.
 *
 * @returns void
 */
export const deleteProduct = async (id: number): Promise<void> => {
  await query('DELETE FROM products WHERE id = $1', [id]);
};

/**
 * Searches for products by name, brand, or category.
 *
 * @param searchTerm - The search term to match against product name, brand, or category.
 *
 * @returns An array of products matching the search criteria.
 */
export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  const result = await query<Product>(
    `SELECT * FROM products WHERE name ILIKE $1 OR brand ILIKE $1 OR category ILIKE $1`,
    [`%${searchTerm}%`]
  );
  return result.rows;
};
