import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct, 
    searchProducts 
  } from '../../../src/controllers/productController';
  import { 
    createProductService, 
    getAllProductsService, 
    getProductByIdService, 
    updateProductService, 
    deleteProductService, 
    searchProductsService 
  } from '../../../src/services/productService';
  
  jest.mock('../../../src/services/productService');
  
  describe('Product Controller', () => {
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: jest.Mock;
  
    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('createProduct', () => {
      it('should create a new product and return the product data', async () => {
        const mockProduct = { id: 1, name: 'Product 1', description: 'Test product', price: 100, brand: 'Brand A', category: 'Category A', size: 'M' };
        (createProductService as jest.Mock).mockResolvedValue(mockProduct);
        mockRequest.body = mockProduct;
  
        // Call the createProduct controller method
        await createProduct(mockRequest, mockResponse, mockNext);
  
        // Check if the service was called correctly
        expect(createProductService).toHaveBeenCalledWith(mockProduct);
        // Verify the correct response status and JSON output
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
      });
  
      it('should handle errors and call next with the error', async () => {
        const mockError = new Error('Failed to create product');
        (createProductService as jest.Mock).mockRejectedValue(mockError);
  
        // Call the createProduct controller method
        await createProduct(mockRequest, mockResponse, mockNext);
  
        // Ensure the error is passed to next()
        expect(mockNext).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('getAllProducts', () => {
      it('should retrieve all products and return them', async () => {
        const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
        (getAllProductsService as jest.Mock).mockResolvedValue(mockProducts);
  
        // Call the getAllProducts controller method
        await getAllProducts(mockRequest, mockResponse, mockNext);
  
        // Check if the service was called and the response is correct
        expect(getAllProductsService).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
      });
  
      it('should handle errors and call next with the error', async () => {
        const mockError = new Error('Failed to retrieve products');
        (getAllProductsService as jest.Mock).mockRejectedValue(mockError);
  
        // Call the getAllProducts controller method
        await getAllProducts(mockRequest, mockResponse, mockNext);
  
        // Ensure the error is passed to next()
        expect(mockNext).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('getProductById', () => {
      it('should retrieve a product by ID and return it', async () => {
        const mockProduct = { id: 1, name: 'Product 1' };
        (getProductByIdService as jest.Mock).mockResolvedValue(mockProduct);
        mockRequest.params = { id: '1' };
  
        // Call the getProductById controller method
        await getProductById(mockRequest, mockResponse, mockNext);
  
        // Check if the service was called with the correct ID
        expect(getProductByIdService).toHaveBeenCalledWith(1);
        // Verify the response status and JSON output
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
      });
  
      it('should return 404 if product is not found', async () => {
        (getProductByIdService as jest.Mock).mockResolvedValue(null);
        mockRequest.params = { id: '1' };
  
        // Call the getProductById controller method
        await getProductById(mockRequest, mockResponse, mockNext);
  
        // Check if the service was called and 404 status is returned
        expect(getProductByIdService).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product not found' });
      });
  
      it('should handle errors and call next with the error', async () => {
        const mockError = new Error('Failed to retrieve product');
        (getProductByIdService as jest.Mock).mockRejectedValue(mockError);
        mockRequest.params = { id: '1' };
  
        // Call the getProductById controller method
        await getProductById(mockRequest, mockResponse, mockNext);
  
        // Ensure the error is passed to next()
        expect(mockNext).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('updateProduct', () => {
      it('should update a product and return the updated product', async () => {
        const mockProduct = { id: 1, name: 'Updated Product' };
        (updateProductService as jest.Mock).mockResolvedValue(mockProduct);
        mockRequest.params = { id: '1' };
        mockRequest.body = { name: 'Updated Product' };
  
        // Call the updateProduct controller method
        await updateProduct(mockRequest, mockResponse, mockNext);
  
        // Check if the service was called with correct parameters
        expect(updateProductService).toHaveBeenCalledWith(1, { name: 'Updated Product' });
        // Verify the response status and JSON output
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
      });
  
      it('should return 404 if product is not found', async () => {
        (updateProductService as jest.Mock).mockResolvedValue(null);
        mockRequest.params = { id: '1' };
        mockRequest.body = { name: 'Updated Product' };
  
        // Call the updateProduct controller method
        await updateProduct(mockRequest, mockResponse, mockNext);
  
        // Check if the service was called and 404 status is returned
        expect(updateProductService).toHaveBeenCalledWith(1, { name: 'Updated Product' });
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product not found' });
      });
  
      it('should handle errors and call next with the error', async () => {
        const mockError = new Error('Failed to update product');
        (updateProductService as jest.Mock).mockRejectedValue(mockError);
        mockRequest.params = { id: '1' };
  
        // Call the updateProduct controller method
        await updateProduct(mockRequest, mockResponse, mockNext);
  
        // Ensure the error is passed to next()
        expect(mockNext).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('deleteProduct', () => {
      it('should delete a product and return a success message', async () => {
        (deleteProductService as jest.Mock).mockResolvedValue(undefined);
        mockRequest.params = { id: '1' };
  
        // Call the deleteProduct controller method
        await deleteProduct(mockRequest, mockResponse, mockNext);
  
        // Check if the service was called with the correct ID
        expect(deleteProductService).toHaveBeenCalledWith(1);
        // Verify the response status and JSON output
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product successfully deleted' });
      });
  
      it('should handle errors and call next with the error', async () => {
        const mockError = new Error('Failed to delete product');
        (deleteProductService as jest.Mock).mockRejectedValue(mockError);
        mockRequest.params = { id: '1' };
  
        // Call the deleteProduct controller method
        await deleteProduct(mockRequest, mockResponse, mockNext);
  
        // Ensure the error is passed to next()
        expect(mockNext).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('searchProducts', () => {
      it('should search for products and return the results', async () => {
        const mockProducts = [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
        (searchProductsService as jest.Mock).mockResolvedValue(mockProducts);
        mockRequest.query = { q: 'Product' };
  
        // Call the searchProducts controller method
        await searchProducts(mockRequest, mockResponse, mockNext);
  
        // Check if the service was called with the correct search term
        expect(searchProductsService).toHaveBeenCalledWith('Product');
        // Verify the response status and JSON output
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
      });
  
      it('should return 400 if query parameter q is missing', async () => {
        mockRequest.query = {};
  
        // Call the searchProducts controller method
        await searchProducts(mockRequest, mockResponse, mockNext);
  
        // Check if the response status is 400 and the correct error message is returned
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Query parameter q is required' });
      });
  
      it('should handle errors and call next with the error', async () => {
        const mockError = new Error('Failed to search products');
        (searchProductsService as jest.Mock).mockRejectedValue(mockError);
        mockRequest.query = { q: 'Product' };
  
        // Call the searchProducts controller method
        await searchProducts(mockRequest, mockResponse, mockNext);
  
        // Ensure the error is passed to next()
        expect(mockNext).toHaveBeenCalledWith(mockError);
      });
    });
  });
  