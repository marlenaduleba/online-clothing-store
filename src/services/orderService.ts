import { createOrder, getAllOrders, getOrderById, getOrdersByUserId, updateOrder, deleteOrder } from '../models/orderModel.js';

/**
 * Service to create a new order for the user.
 *
 * @param userId - The ID of the user placing the order.
 * @param items - The items included in the order.
 *
 * @returns The newly created order.
 */
export const createOrderService = async (userId: number, items: { product_id: number, quantity: number, price: number }[]) => {
  return await createOrder(userId, items);
};

/**
 * Service to get all orders.
 *
 * @returns An array of all orders.
 */
export const getAllOrdersService = async () => {
  return await getAllOrders();
};

/**
 * Service to get an order by its ID.
 *
 * @param id - The ID of the order to retrieve.
 *
 * @returns The order with the specified ID, or null if not found.
 */
export const getOrderByIdService = async (id: number) => {
  return await getOrderById(id);
};

/**
 * Service to get all orders placed by a specific user.
 *
 * @param userId - The ID of the user whose orders are to be retrieved.
 *
 * @returns An array of the user's orders.
 */
export const getOrdersByUserIdService = async (userId: number) => {
  return await getOrdersByUserId(userId);
};

/**
 * Service to update the total amount of an order.
 *
 * @param id - The ID of the order to update.
 * @param total - The new total amount for the order.
 *
 * @returns The updated order, or null if not found.
 */
export const updateOrderService = async (id: number, total: number) => {
  return await updateOrder(id, total);
};

/**
 * Service to delete an order by its ID.
 *
 * @param id - The ID of the order to delete.
 *
 * @returns void
 */
export const deleteOrderService = async (id: number) => {
  await deleteOrder(id);
};
