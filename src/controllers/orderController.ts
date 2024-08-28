import { Request, Response, NextFunction } from 'express';
import { createOrderService, getAllOrdersService, getOrderByIdService, getOrdersByUserIdService, updateOrderService, deleteOrderService } from '../services/orderService.js';

/**
 * Creates a new order for the user.
 *
 * @param req - The request object containing the order details.
 * @param res - The response object to confirm the order was created.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the created order data.
 */
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const items = req.body.items;
    const order = await createOrderService(userId, items);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all orders.
 *
 * @param req - The request object.
 * @param res - The response object to send the list of orders.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the list of all orders.
 */
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await getAllOrdersService();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a specific order by its ID.
 *
 * @param req - The request object containing the order ID.
 * @param res - The response object to send the order data.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the order data, or an error message if the order is not found.
 */
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await getOrderByIdService(parseInt(req.params.id));
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all orders for the current user.
 *
 * @param req - The request object containing the user's ID.
 * @param res - The response object to send the user's orders.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the user's orders.
 */
export const getCurrentUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const orders = await getOrdersByUserIdService(userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a specific order for the current user by its ID.
 *
 * @param req - The request object containing the order ID.
 * @param res - The response object to send the order data.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the order data, or an error message if the order is not found or does not belong to the user.
 */
export const getCurrentUserOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const order = await getOrderByIdService(parseInt(req.params.id));
    if (!order || order.user_id !== userId) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a specific order by its ID.
 *
 * @param req - The request object containing the updated order details.
 * @param res - The response object to confirm the order was updated.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the updated order data, or an error message if the order is not found.
 */
export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const total = req.body.total;
    const order = await updateOrderService(parseInt(req.params.id), total);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a specific order by its ID.
 *
 * @param req - The request object containing the order ID.
 * @param res - The response object to confirm the order was deleted.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with a message confirming the order was deleted.
 */
export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteOrderService(parseInt(req.params.id));
    res.status(200).json({ message: 'Order successfully deleted' });
  } catch (error) {
    next(error);
  }
};
