import { query } from "../utils/db.js";

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

/**
 * Creates a new order for a user.
 *
 * @param userId - The ID of the user placing the order.
 * @param items - The items included in the order.
 *
 * @returns The newly created order.
 */
export const createOrder = async (
  userId: number,
  items: { product_id: number; quantity: number; price: number }[]
): Promise<Order> => {
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const orderResult = await query<Order>(
    "INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING *",
    [userId, total]
  );
  const order = orderResult.rows[0];

  const orderItemsPromises = items.map((item) =>
    query<OrderItem>(
      "INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES ($1, $2, $3, $4, $5)",
      [
        order.id,
        item.product_id,
        item.quantity,
        item.price,
        item.quantity * item.price,
      ]
    )
  );

  await Promise.all(orderItemsPromises);
  return order;
};

/**
 * Retrieves all orders.
 *
 * @returns An array of all orders.
 */
export const getAllOrders = async (): Promise<Order[]> => {
  const result = await query<Order>("SELECT * FROM orders");
  return result.rows;
};

/**
 * Retrieves an order by its ID.
 *
 * @param id - The ID of the order to retrieve.
 *
 * @returns The order with the specified ID, or null if not found.
 */
export const getOrderById = async (id: number): Promise<Order | null> => {
  const result = await query<Order>("SELECT * FROM orders WHERE id = $1", [id]);
  return result.rows[0] || null;
};

/**
 * Retrieves all orders placed by a specific user.
 *
 * @param userId - The ID of the user whose orders are to be retrieved.
 *
 * @returns An array of the user's orders.
 */
export const getOrdersByUserId = async (userId: number): Promise<Order[]> => {
  const result = await query<Order>("SELECT * FROM orders WHERE user_id = $1", [
    userId,
  ]);
  return result.rows;
};

/**
 * Deletes an order by its ID.
 *
 * @param id - The ID of the order to delete.
 *
 * @returns The number of rows deleted.
 */
export const deleteOrder = async (id: number): Promise<number> => {
  const result = await query("DELETE FROM orders WHERE id = $1", [id]);
  return result.rowCount || 0; // Zwróć rowCount lub 0, jeśli rowCount jest null
};
