import { addItemToCart, getCurrentUserCart, updateCartItem, clearCart } from '../../../src/controllers/cartController';
import { addItemToCartService, getCurrentUserCartService, updateCartItemService, clearCartService } from '../../../src/services/cartService';

jest.mock('../../../src/services/cartService');

describe('Cart Controller', () => {
  // Clear all mock calls after each test to ensure test isolation
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addItemToCart', () => {
    it('should add an item to the cart and return the item data', async () => {
      // Mock request and response objects
      const mockRequest = {
        body: { product_id: 1, quantity: 2, price: 100 },
        user: { id: 1 },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      // Mock the service response
      const mockCartItem = { id: 1, product_id: 1, quantity: 2, price: 100, subtotal: 200 };
      (addItemToCartService as jest.Mock).mockResolvedValue(mockCartItem);

      // Call the controller function
      await addItemToCart(mockRequest as any, mockResponse as any, mockNext);

      // Assert that the service was called with correct parameters
      expect(addItemToCartService).toHaveBeenCalledWith(1, 1, 2, 100);
      // Assert that the correct status and response were sent
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCartItem);
    });

    it('should handle errors and call next with the error', async () => {
      // Mock request and response objects
      const mockRequest = {
        body: { product_id: 1, quantity: 2, price: 100 },
        user: { id: 1 },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();
      const mockError = new Error('Error adding item to cart');

      // Mock the service to throw an error
      (addItemToCartService as jest.Mock).mockRejectedValue(mockError);

      // Call the controller function
      await addItemToCart(mockRequest as any, mockResponse as any, mockNext);

      // Assert that the next function was called with the error
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getCurrentUserCart', () => {
    it('should retrieve and return the current user\'s cart', async () => {
      // Mock request and response objects
      const mockRequest = {
        user: { id: 1 },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      // Mock the service response
      const mockCart = { id: 1, user_id: 1, total: 200, items: [] };
      (getCurrentUserCartService as jest.Mock).mockResolvedValue(mockCart);

      // Call the controller function
      await getCurrentUserCart(mockRequest as any, mockResponse as any, mockNext);

      // Assert that the service was called with correct parameters
      expect(getCurrentUserCartService).toHaveBeenCalledWith(1);
      // Assert that the correct status and response were sent
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCart);
    });

    it('should handle errors and call next with the error', async () => {
      // Mock request and response objects
      const mockRequest = {
        user: { id: 1 },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();
      const mockError = new Error('Error retrieving cart');

      // Mock the service to throw an error
      (getCurrentUserCartService as jest.Mock).mockRejectedValue(mockError);

      // Call the controller function
      await getCurrentUserCart(mockRequest as any, mockResponse as any, mockNext);

      // Assert that the next function was called with the error
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateCartItem', () => {
    it('should update a cart item and return the updated item', async () => {
      // Mock request and response objects
      const mockRequest = {
        body: { cart_item_id: 1, quantity: 3 },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      // Mock the service response
      const mockUpdatedCartItem = { id: 1, cart_id: 1, product_id: 1, quantity: 3, price: 100, subtotal: 300 };
      (updateCartItemService as jest.Mock).mockResolvedValue(mockUpdatedCartItem);

      // Call the controller function
      await updateCartItem(mockRequest as any, mockResponse as any, mockNext);

      // Assert that the service was called with correct parameters
      expect(updateCartItemService).toHaveBeenCalledWith(1, 3);
      // Assert that the correct status and response were sent
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedCartItem);
    });

    it('should return 404 if the cart item is not found', async () => {
      // Mock request and response objects
      const mockRequest = {
        body: { cart_item_id: 1, quantity: 3 },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      // Mock the service to return null (item not found)
      (updateCartItemService as jest.Mock).mockResolvedValue(null);

      // Call the controller function
      await updateCartItem(mockRequest as any, mockResponse as any, mockNext);

      // Assert that the service was called with correct parameters
      expect(updateCartItemService).toHaveBeenCalledWith(1, 3);
      // Assert that 404 status and error message were sent
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Cart item not found' });
    });

    it('should handle errors and call next with the error', async () => {
      // Mock request and response objects
      const mockRequest = {
        body: { cart_item_id: 1, quantity: 3 },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();
      const mockError = new Error('Error updating cart item');

      // Mock the service to throw an error
      (updateCartItemService as jest.Mock).mockRejectedValue(mockError);

      // Call the controller function
      await updateCartItem(mockRequest as any, mockResponse as any, mockNext);

      // Assert that the next function was called with the error
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('clearCart', () => {
    it('should clear the cart and return a success message', async () => {
      // Mock request and response objects
      const mockRequest = {
        user: { id: 1 },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();

      // Call the controller function
      await clearCart(mockRequest as any, mockResponse as any, mockNext);

      // Assert that the service was called with correct parameters
      expect(clearCartService).toHaveBeenCalledWith(1);
      // Assert that the correct status and response were sent
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Cart cleared successfully' });
    });

    it('should handle errors and call next with the error', async () => {
      // Mock request and response objects
      const mockRequest = {
        user: { id: 1 },
      };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const mockNext = jest.fn();
      const mockError = new Error('Error clearing cart');

      // Mock the service to throw an error
      (clearCartService as jest.Mock).mockRejectedValue(mockError);

      // Call the controller function
      await clearCart(mockRequest as any, mockResponse as any, mockNext);

      // Assert that the next function was called with the error
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
