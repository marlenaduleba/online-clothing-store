import { createOrder, getAllOrders, getOrderById, getOrdersByUserId, updateOrder, deleteOrder } from '../models/orderModel.js';

export const createOrderService = async (userId: number, items: { product_id: number, quantity: number, price: number }[]) => {
  return await createOrder(userId, items);
};

export const getAllOrdersService = async () => {
  return await getAllOrders();
};

export const getOrderByIdService = async (id: number) => {
  return await getOrderById(id);
};

export const getOrdersByUserIdService = async (userId: number) => {
  return await getOrdersByUserId(userId);
};

export const updateOrderService = async (id: number, total: number) => {
  return await updateOrder(id, total);
};

export const deleteOrderService = async (id: number) => {
  await deleteOrder(id);
};
