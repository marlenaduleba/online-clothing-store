import {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    updateOrder,
    deleteOrder,
  } from '../../../src/models/orderModel';
  import { query } from '../../../src/utils/db';
  
  // Mocking the query function
  jest.mock('../../../src/utils/db', () => ({
    query: jest.fn(),
  }));
  
  describe('Order Model', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('createOrder', () => {
      it('should create a new order and return the created order', async () => {
        const mockUserId = 1;
        const mockItems = [
          { product_id: 1, quantity: 2, price: 50 },
          { product_id: 2, quantity: 1, price: 100 },
        ];
        const mockOrder = {
          id: 1,
          user_id: mockUserId,
          total: 200,
          created_at: new Date(),
          updated_at: new Date(),
        };
  
        // Mocking query for order creation and inserting order items
        (query as jest.Mock).mockResolvedValueOnce({ rows: [mockOrder] });
        (query as jest.Mock).mockResolvedValue({});
  
        const result = await createOrder(mockUserId, mockItems);
  
        expect(query).toHaveBeenCalledTimes(3); // Expecting three calls: order creation and two order items
        expect(query).toHaveBeenCalledWith(
          'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *',
          [mockUserId, 200]
        );
        expect(result).toEqual(mockOrder);
      });
    });
  
    describe('getAllOrders', () => {
      it('should retrieve all orders and return them', async () => {
        const mockOrders = [
          { id: 1, user_id: 1, total: 200, created_at: new Date(), updated_at: new Date() },
          { id: 2, user_id: 2, total: 150, created_at: new Date(), updated_at: new Date() },
        ];
  
        // Mocking query for retrieving all orders
        (query as jest.Mock).mockResolvedValueOnce({ rows: mockOrders });
  
        const result = await getAllOrders();
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith('SELECT * FROM orders');
        expect(result).toEqual(mockOrders);
      });
    });
  
    describe('getOrderById', () => {
      it('should retrieve an order by ID and return it', async () => {
        const mockOrder = {
          id: 1,
          user_id: 1,
          total: 200,
          created_at: new Date(),
          updated_at: new Date(),
        };
  
        // Mocking query for retrieving an order by ID
        (query as jest.Mock).mockResolvedValueOnce({ rows: [mockOrder] });
  
        const result = await getOrderById(1);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith('SELECT * FROM orders WHERE id = $1', [1]);
        expect(result).toEqual(mockOrder);
      });
  
      it('should return null if the order is not found', async () => {
        // Mocking query to return no rows
        (query as jest.Mock).mockResolvedValueOnce({ rows: [] });
  
        const result = await getOrderById(999);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith('SELECT * FROM orders WHERE id = $1', [999]);
        expect(result).toBeNull();
      });
    });
  
    describe('getOrdersByUserId', () => {
      it('should retrieve orders by user ID and return them', async () => {
        const mockOrders = [
          { id: 1, user_id: 1, total: 200, created_at: new Date(), updated_at: new Date() },
          { id: 2, user_id: 1, total: 150, created_at: new Date(), updated_at: new Date() },
        ];
  
        // Mocking query for retrieving orders by user ID
        (query as jest.Mock).mockResolvedValueOnce({ rows: mockOrders });
  
        const result = await getOrdersByUserId(1);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith('SELECT * FROM orders WHERE user_id = $1', [1]);
        expect(result).toEqual(mockOrders);
      });
    });
  
    describe('updateOrder', () => {
      it('should update an order and return the updated order', async () => {
        const mockOrderId = 1;
        const mockTotal = 250;
        const mockUpdatedOrder = {
          id: mockOrderId,
          user_id: 1,
          total: mockTotal,
          created_at: new Date(),
          updated_at: new Date(),
        };
  
        // Mocking query for updating an order
        (query as jest.Mock).mockResolvedValueOnce({ rows: [mockUpdatedOrder] });
  
        const result = await updateOrder(mockOrderId, mockTotal);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(
          'UPDATE orders SET total = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
          [mockTotal, mockOrderId]
        );
        expect(result).toEqual(mockUpdatedOrder);
      });
  
      it('should return null if the order to update is not found', async () => {
        const mockOrderId = 999;
        const mockTotal = 250;
  
        // Mocking query to return no rows
        (query as jest.Mock).mockResolvedValueOnce({ rows: [] });
  
        const result = await updateOrder(mockOrderId, mockTotal);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith(
          'UPDATE orders SET total = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
          [mockTotal, mockOrderId]
        );
        expect(result).toBeNull();
      });
    });
  
    describe('deleteOrder', () => {
      it('should delete an order by ID and return the number of rows deleted', async () => {
        const mockOrderId = 1;
  
        // Mocking query for deleting an order
        (query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });
  
        const result = await deleteOrder(mockOrderId);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith('DELETE FROM orders WHERE id = $1', [mockOrderId]);
        expect(result).toEqual(1);
      });
  
      it('should return 0 if the order to delete is not found', async () => {
        const mockOrderId = 999;
  
        // Mocking query to return no rows affected
        (query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });
  
        const result = await deleteOrder(mockOrderId);
  
        expect(query).toHaveBeenCalledTimes(1);
        expect(query).toHaveBeenCalledWith('DELETE FROM orders WHERE id = $1', [mockOrderId]);
        expect(result).toEqual(0);
      });
    });
  });
  