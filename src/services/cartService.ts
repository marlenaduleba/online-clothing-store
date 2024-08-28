import { addItemToCart, getCurrentUserCart, updateCartItem, clearCart } from '../models/cartModel.js';

/**
 * Service to add an item to the user's cart.
 *
 * @param userId - The ID of the user.
 * @param productId - The ID of the product to add to the cart.
 * @param quantity - The quantity of the product.
 * @param price - The price of the product.
 *
 * @returns The newly added cart item.
 */
export const addItemToCartService = async (userId: number, productId: number, quantity: number, price: number) => {
  return await addItemToCart(userId, productId, quantity, price);
};

/**
 * Service to get the current user's cart.
 *
 * @param userId - The ID of the user.
 *
 * @returns The user's cart including its items.
 */
export const getCurrentUserCartService = async (userId: number) => {
  return await getCurrentUserCart(userId);
};

/**
 * Service to update the quantity of an item in the user's cart.
 *
 * @param cartItemId - The ID of the cart item to update.
 * @param quantity - The new quantity for the cart item.
 *
 * @returns The updated cart item.
 */
export const updateCartItemService = async (cartItemId: number, quantity: number) => {
  return await updateCartItem(cartItemId, quantity);
};

/**
 * Service to clear the user's cart.
 *
 * @param userId - The ID of the user.
 *
 * @returns void
 */
export const clearCartService = async (userId: number) => {
  await clearCart(userId);
};
