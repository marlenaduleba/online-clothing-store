import { Request, Response, NextFunction } from 'express';
import { createOrderService, getAllOrdersService, getOrderByIdService, getOrdersByUserIdService, updateOrderService, deleteOrderService } from '../services/orderService.js';

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

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await getAllOrdersService();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

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

export const getCurrentUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const orders = await getOrdersByUserIdService(userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

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

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteOrderService(parseInt(req.params.id));
    res.status(200).json({ message: 'Order successfully deleted' });
  } catch (error) {
    next(error);
  }
};
