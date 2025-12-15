/**
 * Domain Layer - Cart Repository Interface
 */

import { CartItem } from '../entities/Cart';

export interface ICartRepository {
  /**
   * Get all cart items
   */
  getCartItems(): Promise<CartItem[]>;

  /**
   * Save cart items
   */
  saveCartItems(items: CartItem[]): Promise<void>;

  /**
   * Clear all cart items
   */
  clearCart(): Promise<void>;
}
