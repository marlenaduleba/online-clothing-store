import { Request, Response, NextFunction } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getCurrentUserOrders,
  getCurrentUserOrderById,
  updateOrder,
  deleteOrder,
} from '../../../src/controllers/orderController';
import {
  createOrderService,
  getAllOrdersService,
  getOrderByIdService,
  getOrdersByUserIdService,
  updateOrderService,
  deleteOrderService,
} from '../../../src/services/orderService';

// Mocking the orderService functions
jest.mock('../../../src/services/orderService', () => ({
  createOrderService: jest.fn(),
  getAllOrdersService: jest.fn(),
  getOrderByIdService: jest.fn(),
  getOrdersByUserIdService: jest.fn(),
  updateOrderService: jest.fn(),
  deleteOrderService: jest.fn(),
}));

describe('Order Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  describe('createOrder', () => {
    it('should create a new order and return the order data', async () => {
      // Arrange: Mock request body and authService response
      (mockRequest as any).user = { id: 1 }; // Ignoring TypeScript error
      mockRequest.body = { items: [{ productId: 1, quantity: 2 }] };
      const mockOrder = { id: 1, userId: 1, items: mockRequest.body.items, total: 100 };
      (createOrderService as jest.Mock).mockResolvedValue(mockOrder);

      // Act: Call the createOrder function
      await createOrder(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert: Verify status and JSON response
      expect(createOrderService).toHaveBeenCalledWith(1, mockRequest.body.items);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should handle errors and call next with the error', async () => {
      // Arrange: Mock request body and an error thrown by createOrderService
      (mockRequest as any).user = { id: 1 };
      mockRequest.body = { items: [{ productId: 1, quantity: 2 }] };
      const mockError = new Error('Order creation failed');
      (createOrderService as jest.Mock).mockRejectedValue(mockError);

      // Act: Call the createOrder function and handle error
      await createOrder(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert: Verify that next was called with the error
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllOrders', () => {
    it('should retrieve all orders and return them', async () => {
      // Arrange: Mock the service response
      const mockOrders = [{ id: 1, userId: 1, items: [{ productId: 1, quantity: 2 }] }];
      (getAllOrdersService as jest.Mock).mockResolvedValue(mockOrders);

      // Act: Call the getAllOrders function
      await getAllOrders(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert: Verify status and JSON response
      expect(getAllOrdersService).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOrders);
    });

    it('should handle errors and call next with the error', async () => {
      // Arrange: Mock an error thrown by getAllOrdersService
      const mockError = new Error('Failed to retrieve orders');
      (getAllOrdersService as jest.Mock).mockRejectedValue(mockError);

      // Act: Call the getAllOrders function and handle error
      await getAllOrders(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert: Verify that next was called with the error
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getOrderById', () => {
    it('should retrieve an order by ID and return it', async () => {
      // Arrange: Mock request params and service response
      mockRequest.params = { id: '1' };
      const mockOrder = { id: 1, userId: 1, items: [{ productId: 1, quantity: 2 }] };
      (getOrderByIdService as jest.Mock).mockResolvedValue(mockOrder);

      // Act: Call the getOrderById function
      await getOrderById(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert: Verify status and JSON response
      expect(getOrderByIdService).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 404 if order is not found', async () => {
      // Arrange: Mock request params and service response
      mockRequest.params = { id: '1' };
      (getOrderByIdService as jest.Mock).mockResolvedValue(null);

      // Act: Call the getOrderById function
      await getOrderById(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert: Verify status and JSON response
      expect(getOrderByIdService).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Order not found' });
    });

    it('should handle errors and call next with the error', async () => {
      // Arrange: Mock request params and an error thrown by getOrderByIdService
      mockRequest.params = { id: '1' };
      const mockError = new Error('Failed to retrieve order');
      (getOrderByIdService as jest.Mock).mockRejectedValue(mockError);

      // Act: Call the getOrderById function and handle error
      await getOrderById(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert: Verify that next was called with the error
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order and return a success message', async () => {
      // Arrange: Mock request params and service response
      mockRequest.params = { id: '1' };
      (deleteOrderService as jest.Mock).mockResolvedValue(true);

      // Act: Call the deleteOrder function
      await deleteOrder(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert: Verify status and JSON response
      expect(deleteOrderService).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Order successfully deleted' });
    });

    it('should return 404 if order to delete is not found', async () => {
        // Arrange: Mock request params and service response
        mockRequest.params = { id: '1' };
        (deleteOrderService as jest.Mock).mockResolvedValue(0);
  
        // Act: Call the deleteOrder function
        await deleteOrder(mockRequest as Request, mockResponse as Response, mockNext);
  
        // Assert: Verify status and JSON response
        expect(deleteOrderService).toHaveBeenCalledWith(1);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Order not found' });
      });
      

    it('should handle errors and call next with the error', async () => {
      // Arrange: Mock request params and an error thrown by deleteOrderService
      mockRequest.params = { id: '1' };
      const mockError = new Error('Failed to delete order');
      (deleteOrderService as jest.Mock).mockRejectedValue(mockError);

      // Act: Call the deleteOrder function and handle error
      await deleteOrder(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert: Verify that next was called with the error
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
