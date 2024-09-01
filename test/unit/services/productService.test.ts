import {
    createProductService,
    getAllProductsService,
    getProductByIdService,
    updateProductService,
    deleteProductService,
    searchProductsService,
  } from '../../../src/services/productService';
  import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
  } from '../../../src/models/productModel';
  
  // Mock the product model functions
  jest.mock('../../../src/models/productModel', () => ({
    createProduct: jest.fn(),
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    searchProducts: jest.fn(),
  }));
  
  describe('Product Service', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('createProductService', () => {
      it('should create a new product', async () => {
        const mockProductData = { name: 'Test Product', price: 100, brand: 'Test Brand' };
        const mockCreatedProduct = { id: 1, ...mockProductData };
  
        (createProduct as jest.Mock).mockResolvedValue(mockCreatedProduct);
  
        const result = await createProductService(mockProductData);
  
        expect(createProduct).toHaveBeenCalledWith(mockProductData);
        expect(result).toEqual(mockCreatedProduct);
      });
  
      it('should throw an error if product creation fails', async () => {
        const mockError = new Error('Product creation failed');
  
        (createProduct as jest.Mock).mockRejectedValue(mockError);
  
        await expect(createProductService({})).rejects.toThrow('Product creation failed');
      });
    });
  
    describe('getAllProductsService', () => {
      it('should retrieve all products', async () => {
        const mockProducts = [
          { id: 1, name: 'Product 1', price: 50 },
          { id: 2, name: 'Product 2', price: 150 },
        ];
  
        (getAllProducts as jest.Mock).mockResolvedValue(mockProducts);
  
        const result = await getAllProductsService();
  
        expect(getAllProducts).toHaveBeenCalled();
        expect(result).toEqual(mockProducts);
      });
  
      it('should throw an error if product retrieval fails', async () => {
        const mockError = new Error('Failed to retrieve products');
  
        (getAllProducts as jest.Mock).mockRejectedValue(mockError);
  
        await expect(getAllProductsService()).rejects.toThrow('Failed to retrieve products');
      });
    });
  
    describe('getProductByIdService', () => {
      it('should retrieve a product by ID', async () => {
        const mockProduct = { id: 1, name: 'Product 1', price: 50 };
  
        (getProductById as jest.Mock).mockResolvedValue(mockProduct);
  
        const result = await getProductByIdService(1);
  
        expect(getProductById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockProduct);
      });
  
      it('should return null if the product is not found', async () => {
        (getProductById as jest.Mock).mockResolvedValue(null);
  
        const result = await getProductByIdService(999);
  
        expect(getProductById).toHaveBeenCalledWith(999);
        expect(result).toBeNull();
      });
  
      it('should throw an error if product retrieval fails', async () => {
        const mockError = new Error('Failed to retrieve product');
  
        (getProductById as jest.Mock).mockRejectedValue(mockError);
  
        await expect(getProductByIdService(1)).rejects.toThrow('Failed to retrieve product');
      });
    });
  
    describe('updateProductService', () => {
      it('should update a product and return the updated product', async () => {
        const mockProductData = { name: 'Updated Product', price: 200 };
        const mockUpdatedProduct = { id: 1, ...mockProductData };
  
        (updateProduct as jest.Mock).mockResolvedValue(mockUpdatedProduct);
  
        const result = await updateProductService(1, mockProductData);
  
        expect(updateProduct).toHaveBeenCalledWith(1, mockProductData);
        expect(result).toEqual(mockUpdatedProduct);
      });
  
      it('should return null if the product is not found', async () => {
        (updateProduct as jest.Mock).mockResolvedValue(null);
  
        const result = await updateProductService(999, {});
  
        expect(updateProduct).toHaveBeenCalledWith(999, {});
        expect(result).toBeNull();
      });
  
      it('should throw an error if product update fails', async () => {
        const mockError = new Error('Failed to update product');
  
        (updateProduct as jest.Mock).mockRejectedValue(mockError);
  
        await expect(updateProductService(1, {})).rejects.toThrow('Failed to update product');
      });
    });
  
    describe('deleteProductService', () => {
      it('should delete a product by ID', async () => {
        (deleteProduct as jest.Mock).mockResolvedValue(undefined);
  
        await deleteProductService(1);
  
        expect(deleteProduct).toHaveBeenCalledWith(1);
      });
  
      it('should throw an error if product deletion fails', async () => {
        const mockError = new Error('Failed to delete product');
  
        (deleteProduct as jest.Mock).mockRejectedValue(mockError);
  
        await expect(deleteProductService(1)).rejects.toThrow('Failed to delete product');
      });
    });
  
    describe('searchProductsService', () => {
      it('should search for products by a search term', async () => {
        const mockSearchTerm = 'Test';
        const mockProducts = [
          { id: 1, name: 'Test Product 1', price: 50 },
          { id: 2, name: 'Test Product 2', price: 150 },
        ];
  
        (searchProducts as jest.Mock).mockResolvedValue(mockProducts);
  
        const result = await searchProductsService(mockSearchTerm);
  
        expect(searchProducts).toHaveBeenCalledWith(mockSearchTerm);
        expect(result).toEqual(mockProducts);
      });
  
      it('should throw an error if product search fails', async () => {
        const mockError = new Error('Failed to search products');
  
        (searchProducts as jest.Mock).mockRejectedValue(mockError);
  
        await expect(searchProductsService('Test')).rejects.toThrow('Failed to search products');
      });
    });
  });
  