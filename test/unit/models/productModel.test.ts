import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
  } from '../../../src/models/productModel';
  import { query } from '../../../src/utils/db';
  
  // Mocking the query function
  jest.mock('../../../src/utils/db', () => ({
    query: jest.fn(),
  }));
  
  describe('Product Model', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('createProduct', () => {
      it('should create a new product and return the created product', async () => {
        const mockProductData = {
          name: 'Product Name',
          description: 'Product Description',
          price: 99.99,
          brand: 'Brand Name',
          category: 'Category Name',
          size: 'M',
        };
        const mockProduct = {
          id: 1,
          ...mockProductData,
        };
  
        // Mocking query for product creation
        (query as jest.Mock).mockResolvedValueOnce({ rows: [mockProduct] });
  
        const result = await createProduct(mockProductData);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(
          'INSERT INTO products (name, description, price, brand, category, size) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
          [
            mockProductData.name,
            mockProductData.description,
            mockProductData.price,
            mockProductData.brand,
            mockProductData.category,
            mockProductData.size,
          ]
        );
        expect(result).toEqual(mockProduct);
      });
    });
  
    describe('getAllProducts', () => {
      it('should retrieve all products and return them', async () => {
        const mockProducts = [
          { id: 1, name: 'Product 1', description: 'Description 1', price: 50, brand: 'Brand 1', category: 'Category 1', size: 'M' },
          { id: 2, name: 'Product 2', description: 'Description 2', price: 100, brand: 'Brand 2', category: 'Category 2', size: 'L' },
        ];
  
        // Mocking query for retrieving all products
        (query as jest.Mock).mockResolvedValueOnce({ rows: mockProducts });
  
        const result = await getAllProducts();
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith('SELECT * FROM products');
        expect(result).toEqual(mockProducts);
      });
    });
  
    describe('getProductById', () => {
      it('should retrieve a product by ID and return it', async () => {
        const mockProduct = {
          id: 1,
          name: 'Product Name',
          description: 'Product Description',
          price: 99.99,
          brand: 'Brand Name',
          category: 'Category Name',
          size: 'M',
        };
  
        // Mocking query for retrieving a product by ID
        (query as jest.Mock).mockResolvedValueOnce({ rows: [mockProduct] });
  
        const result = await getProductById(1);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith('SELECT * FROM products WHERE id = $1', [1]);
        expect(result).toEqual(mockProduct);
      });
  
      it('should return null if the product is not found', async () => {
        // Mocking query to return no rows
        (query as jest.Mock).mockResolvedValueOnce({ rows: [] });
  
        const result = await getProductById(999);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith('SELECT * FROM products WHERE id = $1', [999]);
        expect(result).toBeNull();
      });
    });
  
    describe('updateProduct', () => {
      it('should update a product and return the updated product', async () => {
        const mockProductId = 1;
        const mockProductData = {
          name: 'Updated Product Name',
          description: 'Updated Description',
          price: 89.99,
        };
        const mockUpdatedProduct = {
          id: mockProductId,
          ...mockProductData,
          brand: 'Brand Name',
          category: 'Category Name',
          size: 'M',
        };
  
        // Mocking query for updating a product
        (query as jest.Mock).mockResolvedValueOnce({ rows: [mockUpdatedProduct] });
  
        const result = await updateProduct(mockProductId, mockProductData);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(
          'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *',
          [
            mockProductData.name,
            mockProductData.description,
            mockProductData.price,
            mockProductId,
          ]
        );
        expect(result).toEqual(mockUpdatedProduct);
      });
  
      it('should return null if the product to update is not found', async () => {
        const mockProductId = 999;
        const mockProductData = {
          name: 'Updated Product Name',
          description: 'Updated Description',
          price: 89.99,
        };
  
        // Mocking query to return no rows
        (query as jest.Mock).mockResolvedValueOnce({ rows: [] });
  
        const result = await updateProduct(mockProductId, mockProductData);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(
          'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *',
          [
            mockProductData.name,
            mockProductData.description,
            mockProductData.price,
            mockProductId,
          ]
        );
        expect(result).toBeNull();
      });
    });
  
    describe('deleteProduct', () => {
      it('should delete a product by ID and return void', async () => {
        const mockProductId = 1;
  
        // Mocking query for deleting a product
        (query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });
  
        const result = await deleteProduct(mockProductId);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith('DELETE FROM products WHERE id = $1', [mockProductId]);
        expect(result).toBeUndefined();
      });
    });
  
    describe('searchProducts', () => {
      it('should search for products by name, brand, or category and return matching products', async () => {
        const mockSearchTerm = 'Product';
        const mockProducts = [
          { id: 1, name: 'Product 1', description: 'Description 1', price: 50, brand: 'Brand 1', category: 'Category 1', size: 'M' },
          { id: 2, name: 'Product 2', description: 'Description 2', price: 100, brand: 'Brand 2', category: 'Category 2', size: 'L' },
        ];
  
        // Mocking query for searching products
        (query as jest.Mock).mockResolvedValueOnce({ rows: mockProducts });
  
        const result = await searchProducts(mockSearchTerm);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(
          'SELECT * FROM products WHERE name ILIKE $1 OR brand ILIKE $1 OR category ILIKE $1',
          [`%${mockSearchTerm}%`]
        );
        expect(result).toEqual(mockProducts);
      });
    });
  });
  