import {
    addItemToCart,
    getCurrentUserCart,
    updateCartItem,
    clearCart,
} from '../../../src/models/cartModel';
import { query } from '../../../src/utils/db';

// Mocking the query function
jest.mock('../../../src/utils/db', () => ({
    query: jest.fn(),
}));

describe('Cart Model', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('addItemToCart', () => {
        it('should add an item to the cart and return the cart item', async () => {
            const mockUserId = 1;
            const mockProductId = 1;
            const mockQuantity = 2;
            const mockPrice = 50;
            const mockCartItem = {
                id: 1,
                cart_id: 1,
                product_id: mockProductId,
                quantity: mockQuantity,
                price: mockPrice,
                subtotal: mockQuantity * mockPrice,
            };

            // Mocking getOrCreateCart and query
            (query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });
            (query as jest.Mock).mockResolvedValueOnce({ rows: [mockCartItem] });
            (query as jest.Mock).mockResolvedValueOnce({ rows: [] }); // For updateCartTotal

            const result = await addItemToCart(mockUserId, mockProductId, mockQuantity, mockPrice);

            expect(query).toHaveBeenCalledTimes(3); // Expecting three calls
            expect(query).toHaveBeenCalledWith(
                'INSERT INTO cart_items (cart_id, product_id, quantity, price, subtotal) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [1, mockProductId, mockQuantity, mockPrice, mockQuantity * mockPrice]
            );
            expect(query).toHaveBeenCalledWith(
                'UPDATE carts SET total = (SELECT COALESCE(SUM(subtotal), 0) FROM cart_items WHERE cart_id = $1) WHERE id = $1',
                [1]
            );
            expect(result).toEqual(mockCartItem);
        });
    });

    describe('getCurrentUserCart', () => {
        it('should retrieve the user\'s cart with items', async () => {
            const mockUserId = 1;
            const mockCart = {
                id: 1,
                user_id: mockUserId,
                total: 100,
            };
            const mockCartItems = [
                {
                    id: 1,
                    cart_id: 1,
                    product_id: 1,
                    quantity: 2,
                    price: 50,
                    subtotal: 100,
                },
            ];

            // Mocking getOrCreateCart and query
            (query as jest.Mock).mockResolvedValueOnce({ rows: [mockCart] });
            (query as jest.Mock).mockResolvedValueOnce({ rows: mockCartItems });

            const result = await getCurrentUserCart(mockUserId);

            expect(query).toHaveBeenCalledTimes(2);
            expect(result).toEqual({ ...mockCart, items: mockCartItems });
        });
    });

    describe('updateCartItem', () => {
        it('should update the quantity of a cart item and return the updated item', async () => {
            const mockCartItemId = 1;
            const mockQuantity = 3;
            const mockUpdatedCartItem = {
                id: mockCartItemId,
                cart_id: 1,
                product_id: 1,
                quantity: mockQuantity,
                price: 50,
                subtotal: mockQuantity * 50,
            };

            // Mocking query
            (query as jest.Mock).mockResolvedValueOnce({ rows: [mockUpdatedCartItem] });

            const result = await updateCartItem(mockCartItemId, mockQuantity);

            expect(query).toHaveBeenCalledWith(
                'UPDATE cart_items SET quantity = $1, subtotal = quantity * price WHERE id = $2 RETURNING *',
                [mockQuantity, mockCartItemId]
            );
            expect(result).toEqual(mockUpdatedCartItem);
        });

        it('should return null if the cart item is not found', async () => {
            const mockCartItemId = 999;
            const mockQuantity = 3;

            // Mocking query
            (query as jest.Mock).mockResolvedValueOnce({ rows: [] });

            const result = await updateCartItem(mockCartItemId, mockQuantity);

            expect(query).toHaveBeenCalledWith(
                'UPDATE cart_items SET quantity = $1, subtotal = quantity * price WHERE id = $2 RETURNING *',
                [mockQuantity, mockCartItemId]
            );
            expect(result).toBeNull();
        });
    });

    describe('clearCart', () => {
        it('should clear all items from the user\'s cart', async () => {
            const mockUserId = 1;

            // Mocking getOrCreateCart and query
            (query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: 1 }] });

            await clearCart(mockUserId);

            expect(query).toHaveBeenCalledWith('DELETE FROM cart_items WHERE cart_id = $1', [1]);
            expect(query).toHaveBeenCalledWith(
                'UPDATE carts SET total = (SELECT COALESCE(SUM(subtotal), 0) FROM cart_items WHERE cart_id = $1) WHERE id = $1',
                [1]
            );
        });
    });
});
