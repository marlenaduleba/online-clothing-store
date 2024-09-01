import {
    createOrderService,
    getAllOrdersService,
    getOrderByIdService,
    getOrdersByUserIdService,
    updateOrderService,
    deleteOrderService,
  } from '../../../src/services/orderService';
  import {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    updateOrder,
    deleteOrder,
  } from '../../../src/models/orderModel';
  
  // Mock the order model functions
  jest.mock('../../../src/models/orderModel', () => ({
    createOrder: jest.fn(),
    getAllOrders: jest.fn(),
    getOrderById: jest.fn(),
    getOrdersByUserId: jest.fn(),
    updateOrder: jest.fn(),
    deleteOrder: jest.fn(),
  }));
  
  describe('Order Service', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test to prevent state leakage
    });
  
    describe('createOrderService', () => {
      it('should create a new order', async () => {
        const mockUserId = 1;
        const mockItems = [{ product_id: 1, quantity: 2, price: 50 }];
        const mockOrder = { id: 1, user_id: mockUserId, total: 100 };
  
        // Mock the createOrder function to return a specific value
        (createOrder as jest.Mock).mockResolvedValue(mockOrder);
  
        const result = await createOrderService(mockUserId, mockItems);
  
        expect(createOrder).toHaveBeenCalledWith(mockUserId, mockItems); // Verify the function was called with correct arguments
        expect(result).toEqual(mockOrder); // Check the returned value
      });
  
      it('should throw an error if order creation fails', async () => {
        const mockError = new Error('Failed to create order');
  
        // Mock the createOrder function to throw an error
        (createOrder as jest.Mock).mockRejectedValue(mockError);
  
        // Expect the service to throw the same error
        await expect(createOrderService(1, [])).rejects.toThrow('Failed to create order');
      });
    });
  
    describe('getAllOrdersService', () => {
      it('should retrieve all orders', async () => {
        const mockOrders = [{ id: 1, user_id: 1, total: 100 }];
  
        // Mock the getAllOrders function to return a specific value
        (getAllOrders as jest.Mock).mockResolvedValue(mockOrders);
  
        const result = await getAllOrdersService();
  
        expect(getAllOrders).toHaveBeenCalled(); // Ensure the function was called
        expect(result).toEqual(mockOrders); // Verify the returned value
      });
  
      it('should throw an error if retrieving all orders fails', async () => {
        const mockError = new Error('Failed to retrieve orders');
  
        // Mock the getAllOrders function to throw an error
        (getAllOrders as jest.Mock).mockRejectedValue(mockError);
  
        // Expect the service to throw the same error
        await expect(getAllOrdersService()).rejects.toThrow('Failed to retrieve orders');
      });
    });
  
    describe('getOrderByIdService', () => {
      it('should retrieve an order by ID', async () => {
        const mockOrder = { id: 1, user_id: 1, total: 100 };
  
        // Mock the getOrderById function to return a specific order
        (getOrderById as jest.Mock).mockResolvedValue(mockOrder);
  
        const result = await getOrderByIdService(1);
  
        expect(getOrderById).toHaveBeenCalledWith(1); // Ensure the function was called with the correct ID
        expect(result).toEqual(mockOrder); // Verify the returned order
      });
  
      it('should return null if the order is not found', async () => {
        // Mock the getOrderById function to return null
        (getOrderById as jest.Mock).mockResolvedValue(null);
  
        const result = await getOrderByIdService(999);
  
        expect(getOrderById).toHaveBeenCalledWith(999); // Ensure the function was called with the correct ID
        expect(result).toBeNull(); // Verify that the result is null
      });
  
      it('should throw an error if retrieving the order fails', async () => {
        const mockError = new Error('Failed to retrieve order');
  
        // Mock the getOrderById function to throw an error
        (getOrderById as jest.Mock).mockRejectedValue(mockError);
  
        // Expect the service to throw the same error
        await expect(getOrderByIdService(1)).rejects.toThrow('Failed to retrieve order');
      });
    });
  
    describe('getOrdersByUserIdService', () => {
      it('should retrieve all orders for a specific user', async () => {
        const mockUserId = 1;
        const mockOrders = [{ id: 1, user_id: mockUserId, total: 100 }];
  
        // Mock the getOrdersByUserId function to return specific orders
        (getOrdersByUserId as jest.Mock).mockResolvedValue(mockOrders);
  
        const result = await getOrdersByUserIdService(mockUserId);
  
        expect(getOrdersByUserId).toHaveBeenCalledWith(mockUserId); // Ensure the function was called with the correct user ID
        expect(result).toEqual(mockOrders); // Verify the returned orders
      });
  
      it('should throw an error if retrieving the user\'s orders fails', async () => {
        const mockError = new Error('Failed to retrieve user orders');
  
        // Mock the getOrdersByUserId function to throw an error
        (getOrdersByUserId as jest.Mock).mockRejectedValue(mockError);
  
        // Expect the service to throw the same error
        await expect(getOrdersByUserIdService(1)).rejects.toThrow('Failed to retrieve user orders');
      });
    });
  
    describe('updateOrderService', () => {
      it('should update an order and return the updated order', async () => {
        const mockOrderId = 1;
        const mockTotal = 150;
        const mockUpdatedOrder = { id: mockOrderId, user_id: 1, total: mockTotal };
  
        // Mock the updateOrder function to return an updated order
        (updateOrder as jest.Mock).mockResolvedValue(mockUpdatedOrder);
  
        const result = await updateOrderService(mockOrderId, mockTotal);
  
        expect(updateOrder).toHaveBeenCalledWith(mockOrderId, mockTotal); // Ensure the function was called with the correct arguments
        expect(result).toEqual(mockUpdatedOrder); // Verify the returned updated order
      });
  
      it('should return null if the order is not found', async () => {
        // Mock the updateOrder function to return null
        (updateOrder as jest.Mock).mockResolvedValue(null);
  
        const result = await updateOrderService(999, 150);
  
        expect(updateOrder).toHaveBeenCalledWith(999, 150); // Ensure the function was called with the correct arguments
        expect(result).toBeNull(); // Verify that the result is null
      });
  
      it('should throw an error if updating the order fails', async () => {
        const mockError = new Error('Failed to update order');
  
        // Mock the updateOrder function to throw an error
        (updateOrder as jest.Mock).mockRejectedValue(mockError);
  
        // Expect the service to throw the same error
        await expect(updateOrderService(1, 150)).rejects.toThrow('Failed to update order');
      });
    });
  
    describe('deleteOrderService', () => {
      it('should delete an order and return the number of rows deleted', async () => {
        const mockOrderId = 1;
        const mockDeletedRows = 1;
  
        // Mock the deleteOrder function to return the number of deleted rows
        (deleteOrder as jest.Mock).mockResolvedValue(mockDeletedRows);
  
        const result = await deleteOrderService(mockOrderId);
  
        expect(deleteOrder).toHaveBeenCalledWith(mockOrderId); // Ensure the function was called with the correct ID
        expect(result).toEqual(mockDeletedRows); // Verify the number of deleted rows
      });
  
      it('should throw an error if deleting the order fails', async () => {
        const mockError = new Error('Failed to delete order');
  
        // Mock the deleteOrder function to throw an error
        (deleteOrder as jest.Mock).mockRejectedValue(mockError);
  
        // Expect the service to throw the same error
        await expect(deleteOrderService(1)).rejects.toThrow('Failed to delete order');
      });
    });
  });
  