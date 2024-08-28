import { Request, Response, NextFunction } from 'express';
import { addItemToCartService, getCurrentUserCartService, updateCartItemService, clearCartService } from '../services/cartService.js';

/**
 * Adds an item to the user's cart.
 *
 * @param req - The request object containing the item details.
 * @param res - The response object to confirm the item was added.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with a message confirming the item was added to the cart.
 */
export const addItemToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { product_id, quantity, price } = req.body;
    const userId = req.user.id;
    const cartItem = await addItemToCartService(userId, product_id, quantity, price);
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the current user's cart.
 *
 * @param req - The request object containing the user's ID.
 * @param res - The response object to send the cart data.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the user's cart data.
 */
export const getCurrentUserCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const cart = await getCurrentUserCartService(userId);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a specific item in the user's cart.
 *
 * @param req - The request object containing the cart item ID and the new quantity.
 * @param res - The response object to confirm the item was updated.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the updated cart item data, or an error message if the item was not found.
 */
export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cart_item_id, quantity } = req.body;
    const cartItem = await updateCartItemService(cart_item_id, quantity);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    res.status(200).json(cartItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Clears the current user's cart.
 *
 * @param req - The request object containing the user's ID.
 * @param res - The response object to confirm the cart was cleared.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with a message confirming the cart was cleared.
 */
export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    await clearCartService(userId);
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    next(error);
  }
};
