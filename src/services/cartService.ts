import { addItemToCart, getCurrentUserCart, updateCartItem, clearCart } from '../models/cartModel.js';

export const addItemToCartService = async (userId: number, productId: number, quantity: number, price: number) => {
  return await addItemToCart(userId, productId, quantity, price);
};

export const getCurrentUserCartService = async (userId: number) => {
  return await getCurrentUserCart(userId);
};

export const updateCartItemService = async (cartItemId: number, quantity: number) => {
  return await updateCartItem(cartItemId, quantity);
};

export const clearCartService = async (userId: number) => {
  await clearCart(userId);
};
