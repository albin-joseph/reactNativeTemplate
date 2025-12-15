/**
 * Domain Layer - Cart Use Cases
 */

import { UseCase } from './UseCase';
import { ICartRepository } from '../repositories/ICartRepository';
import { CartItem } from '../entities/Cart';
import { Product } from '../entities/Product';

// Add to Cart Use Case
export class AddToCartUseCase extends UseCase<Product, void> {
  constructor(private cartRepository: ICartRepository) {
    super();
  }

  async execute(product: Product): Promise<void> {
    const items = await this.cartRepository.getCartItems();
    const existingItem = items.find((item) => item.product.id === product.id);

    let updatedItems: CartItem[];
    if (existingItem) {
      updatedItems = items.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedItems = [...items, { product, quantity: 1 }];
    }

    await this.cartRepository.saveCartItems(updatedItems);
  }
}

// Remove from Cart Use Case
export class RemoveFromCartUseCase extends UseCase<number, void> {
  constructor(private cartRepository: ICartRepository) {
    super();
  }

  async execute(productId: number): Promise<void> {
    const items = await this.cartRepository.getCartItems();
    const updatedItems = items.filter((item) => item.product.id !== productId);
    await this.cartRepository.saveCartItems(updatedItems);
  }
}

// Update Cart Item Quantity Use Case
export interface UpdateQuantityParams {
  productId: number;
  quantity: number;
}

export class UpdateCartQuantityUseCase extends UseCase<UpdateQuantityParams, void> {
  constructor(private cartRepository: ICartRepository) {
    super();
  }

  async execute(params: UpdateQuantityParams): Promise<void> {
    const { productId, quantity } = params;
    const items = await this.cartRepository.getCartItems();

    let updatedItems: CartItem[];
    if (quantity <= 0) {
      updatedItems = items.filter((item) => item.product.id !== productId);
    } else {
      updatedItems = items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    }

    await this.cartRepository.saveCartItems(updatedItems);
  }
}

// Clear Cart Use Case
export class ClearCartUseCase extends UseCase<void, void> {
  constructor(private cartRepository: ICartRepository) {
    super();
  }

  async execute(): Promise<void> {
    await this.cartRepository.clearCart();
  }
}

// Get Cart Items Use Case
export class GetCartItemsUseCase extends UseCase<void, CartItem[]> {
  constructor(private cartRepository: ICartRepository) {
    super();
  }

  async execute(): Promise<CartItem[]> {
    return this.cartRepository.getCartItems();
  }
}
