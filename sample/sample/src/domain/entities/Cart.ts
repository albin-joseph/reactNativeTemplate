/**
 * Domain Layer - Cart Entity
 */

import { Product } from './Product';

export interface CartItem {
  readonly product: Product;
  readonly quantity: number;
}

export interface Cart {
  readonly items: CartItem[];
  readonly totalItems: number;
  readonly totalPrice: number;
}

export const calculateCartTotals = (items: CartItem[]): Pick<Cart, 'totalItems' | 'totalPrice'> => {
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  };
};
