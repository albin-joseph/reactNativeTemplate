/**
 * State Layer - Cart State Types
 */

import { CartItem } from '../../../domain/entities/Cart';

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  error: string | null;
}
