import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  deleteOrder,
} from "../models/orderModel.js";

/**
 * Service to create a new order for the user.
 *
 * @param userId - The ID of the user placing the order.
 * @param items - The items included in the order.
 *
 * @returns The newly created order.
 */
export const createOrderService = async (
  userId: number,
  items: { product_id: number; quantity: number; price: number }[]
) => {
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
 * Service to delete an order by its ID.
 *
 * @param id - The ID of the order to delete.
 *
 * @returns The number of rows deleted.
 */
export const deleteOrderService = async (id: number): Promise<number> => {
  return await deleteOrder(id);
};
