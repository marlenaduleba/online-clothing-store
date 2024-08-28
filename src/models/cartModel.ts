import { query } from '../utils/db.js';

interface Cart {
  id: number;
  user_id: number;
  total: number;
  created_at: Date;
  updated_at: Date;
}

interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
}

/**
 * Adds an item to the user's cart.
 *
 * @param userId - The ID of the user.
 * @param productId - The ID of the product to be added to the cart.
 * @param quantity - The quantity of the product to add.
 * @param price - The price of the product.
 *
 * @returns The newly added cart item.
 */
export const addItemToCart = async (userId: number, productId: number, quantity: number, price: number): Promise<CartItem> => {
  const subtotal = quantity * price;
  const cart = await getOrCreateCart(userId);
  const result = await query<CartItem>(
    'INSERT INTO cart_items (cart_id, product_id, quantity, price, subtotal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [cart.id, productId, quantity, price, subtotal]
  );
  await updateCartTotal(cart.id);
  return result.rows[0];
};

/**
 * Retrieves the user's cart or creates a new one if it doesn't exist.
 *
 * @param userId - The ID of the user.
 *
 * @returns The user's cart.
 */
const getOrCreateCart = async (userId: number): Promise<Cart> => {
  const result = await query<Cart>('SELECT * FROM carts WHERE user_id = $1', [userId]);
  if (result.rows.length > 0) {
    return result.rows[0];
  }
  const newCart = await query<Cart>('INSERT INTO carts (user_id, total) VALUES ($1, $2) RETURNING *', [userId, 0]);
  return newCart.rows[0];
};

/**
 * Retrieves the current user's cart along with its items.
 *
 * @param userId - The ID of the user.
 *
 * @returns The user's cart including the items.
 */
export const getCurrentUserCart = async (userId: number): Promise<Cart & { items: CartItem[] }> => {
  const cart = await getOrCreateCart(userId);
  const itemsResult = await query<CartItem>('SELECT * FROM cart_items WHERE cart_id = $1', [cart.id]);
  return { ...cart, items: itemsResult.rows };
};

/**
 * Updates the quantity of a specific item in the cart.
 *
 * @param cartItemId - The ID of the cart item to update.
 * @param quantity - The new quantity for the cart item.
 *
 * @returns The updated cart item or null if not found.
 */
export const updateCartItem = async (cartItemId: number, quantity: number): Promise<CartItem | null> => {
  const result = await query<CartItem>('UPDATE cart_items SET quantity = $1, subtotal = quantity * price WHERE id = $2 RETURNING *', [quantity, cartItemId]);
  if (result.rows.length === 0) {
    return null;
  }
  await updateCartTotal(result.rows[0].cart_id);
  return result.rows[0];
};

/**
 * Clears all items from the user's cart.
 *
 * @param userId - The ID of the user.
 *
 * @returns void
 */
export const clearCart = async (userId: number): Promise<void> => {
  const cart = await getOrCreateCart(userId);
  await query('DELETE FROM cart_items WHERE cart_id = $1', [cart.id]);
  await updateCartTotal(cart.id);
};

/**
 * Updates the total cost of the cart.
 *
 * @param cartId - The ID of the cart to update.
 *
 * @returns void
 */
const updateCartTotal = async (cartId: number): Promise<void> => {
  await query('UPDATE carts SET total = (SELECT COALESCE(SUM(subtotal), 0) FROM cart_items WHERE cart_id = $1) WHERE id = $1', [cartId]);
};
