import { query } from '../utils/db.js';

interface Order {
  id: number;
  user_id: number;
  total: number;
  created_at: Date;
  updated_at: Date;
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
}

// Create a new order
export const createOrder = async (userId: number, items: { product_id: number, quantity: number, price: number }[]): Promise<Order> => {
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const orderResult = await query<Order>(
    'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *',
    [userId, total]
  );
  const order = orderResult.rows[0];

  const orderItemsPromises = items.map(item =>
    query<OrderItem>(
      'INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES ($1, $2, $3, $4, $5)',
      [order.id, item.product_id, item.quantity, item.price, item.quantity * item.price]
    )
  );

  await Promise.all(orderItemsPromises);
  return order;
};

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  const result = await query<Order>('SELECT * FROM orders');
  return result.rows;
};

// Get an order by ID
export const getOrderById = async (id: number): Promise<Order | null> => {
  const result = await query<Order>('SELECT * FROM orders WHERE id = $1', [id]);
  return result.rows[0] || null;
};

// Get orders by user ID
export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
  const result = await query<Order>('SELECT * FROM orders WHERE user_id = $1', [userId]);
  return result.rows;
};

// Update an order
export const updateOrder = async (id: number, total: number): Promise<Order | null> => {
  const result = await query<Order>('UPDATE orders SET total = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [total, id]);
  return result.rows[0] || null;
};

// Delete an order by ID
export const deleteOrder = async (id: number): Promise<void> => {
  await query('DELETE FROM orders WHERE id = $1', [id]);
};
