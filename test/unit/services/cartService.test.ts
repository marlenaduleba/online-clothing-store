import {
    addItemToCartService,
    getCurrentUserCartService,
    updateCartItemService,
    clearCartService,
  } from '../../../src/services/cartService';
  import {
    addItemToCart,
    getCurrentUserCart,
    updateCartItem,
    clearCart,
  } from '../../../src/models/cartModel';
  
  // Mock the cart model functions
  jest.mock('../../../src/models/cartModel', () => ({
    addItemToCart: jest.fn(),
    getCurrentUserCart: jest.fn(),
    updateCartItem: jest.fn(),
    clearCart: jest.fn(),
  }));
  
  describe('Cart Service', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('addItemToCartService', () => {
      it('should add an item to the cart', async () => {
        const mockUserId = 1;
        const mockProductId = 1;
        const mockQuantity = 2;
        const mockPrice = 50;
        const mockCartItem = { id: 1, cart_id: 1, product_id: mockProductId, quantity: mockQuantity, price: mockPrice, subtotal: 100 };
  
        (addItemToCart as jest.Mock).mockResolvedValue(mockCartItem);
  
        const result = await addItemToCartService(mockUserId, mockProductId, mockQuantity, mockPrice);
  
        expect(addItemToCart).toHaveBeenCalledWith(mockUserId, mockProductId, mockQuantity, mockPrice);
        expect(result).toEqual(mockCartItem);
      });
  
      it('should throw an error if adding item to cart fails', async () => {
        const mockError = new Error('Failed to add item to cart');
  
        (addItemToCart as jest.Mock).mockRejectedValue(mockError);
  
        await expect(addItemToCartService(1, 1, 1, 50)).rejects.toThrow('Failed to add item to cart');
      });
    });
  
    describe('getCurrentUserCartService', () => {
      it('should retrieve the current user\'s cart', async () => {
        const mockUserId = 1;
        const mockCart = { id: 1, user_id: mockUserId, items: [], total: 0 };
  
        (getCurrentUserCart as jest.Mock).mockResolvedValue(mockCart);
  
        const result = await getCurrentUserCartService(mockUserId);
  
        expect(getCurrentUserCart).toHaveBeenCalledWith(mockUserId);
        expect(result).toEqual(mockCart);
      });
  
      it('should throw an error if retrieving the cart fails', async () => {
        const mockError = new Error('Failed to retrieve cart');
  
        (getCurrentUserCart as jest.Mock).mockRejectedValue(mockError);
  
        await expect(getCurrentUserCartService(1)).rejects.toThrow('Failed to retrieve cart');
      });
    });
  
    describe('updateCartItemService', () => {
      it('should update a cart item and return the updated item', async () => {
        const mockCartItemId = 1;
        const mockQuantity = 3;
        const mockUpdatedCartItem = { id: mockCartItemId, cart_id: 1, product_id: 1, quantity: mockQuantity, price: 50, subtotal: 150 };
  
        (updateCartItem as jest.Mock).mockResolvedValue(mockUpdatedCartItem);
  
        const result = await updateCartItemService(mockCartItemId, mockQuantity);
  
        expect(updateCartItem).toHaveBeenCalledWith(mockCartItemId, mockQuantity);
        expect(result).toEqual(mockUpdatedCartItem);
      });
  
      it('should return null if the cart item is not found', async () => {
        (updateCartItem as jest.Mock).mockResolvedValue(null);
  
        const result = await updateCartItemService(999, 3);
  
        expect(updateCartItem).toHaveBeenCalledWith(999, 3);
        expect(result).toBeNull();
      });
  
      it('should throw an error if updating the cart item fails', async () => {
        const mockError = new Error('Failed to update cart item');
  
        (updateCartItem as jest.Mock).mockRejectedValue(mockError);
  
        await expect(updateCartItemService(1, 3)).rejects.toThrow('Failed to update cart item');
      });
    });
  
    describe('clearCartService', () => {
      it('should clear the user\'s cart', async () => {
        const mockUserId = 1;
  
        (clearCart as jest.Mock).mockResolvedValue(undefined);
  
        await clearCartService(mockUserId);
  
        expect(clearCart).toHaveBeenCalledWith(mockUserId);
      });
  
      it('should throw an error if clearing the cart fails', async () => {
        const mockError = new Error('Failed to clear cart');
  
        (clearCart as jest.Mock).mockRejectedValue(mockError);
  
        await expect(clearCartService(1)).rejects.toThrow('Failed to clear cart');
      });
    });
  });
  