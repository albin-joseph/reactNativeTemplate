/**
 * Data Layer - Cart Repository Implementation
 */

import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { CartItem } from '../../domain/entities/Cart';
import { IStorageService } from '../../platform/storage/IStorageService';
import { STORAGE_KEYS } from '../../core/config/constants';

export class CartRepository implements ICartRepository {
  constructor(private storageService: IStorageService) {}

  async getCartItems(): Promise<CartItem[]> {
    const items = await this.storageService.get<CartItem[]>(STORAGE_KEYS.CART);
    return items || [];
  }

  async saveCartItems(items: CartItem[]): Promise<void> {
    await this.storageService.set(STORAGE_KEYS.CART, items);
  }

  async clearCart(): Promise<void> {
    await this.storageService.remove(STORAGE_KEYS.CART);
  }
}
