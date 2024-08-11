import { Request, Response, NextFunction } from "express";
import {
  addItemToCartService,
  getCurrentUserCartService,
  updateCartItemService,
  clearCartService,
} from "../services/cartervice.js";

export const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { product_id, quantity, price } = req.body;
    const userId = req.user.id;
    const cartItem = await addItemToCartService(
      userId,
      product_id,
      quantity,
      price
    );
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUserCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const cart = await getCurrentUserCartService(userId);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cart_item_id, quantity } = req.body;
    const cartItem = await updateCartItemService(cart_item_id, quantity);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.status(200).json(cartItem);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    await clearCartService(userId);
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    next(error);
  }
};
