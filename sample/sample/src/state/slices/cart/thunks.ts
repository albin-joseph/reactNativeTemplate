/**
 * State Layer - Cart Thunks
 * Redux thunks using use cases from domain layer
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { container } from '../../../core/di/container';
import { Product } from '../../../domain/entities/Product';
import { CartItem } from '../../../domain/entities/Cart';

export const loadCart = createAsyncThunk<CartItem[], void, { rejectValue: string }>(
  'cart/loadCart',
  async (_, { rejectWithValue }) => {
    try {
      const useCase = container.getCartItemsUseCase;
      return await useCase.execute();
    } catch (error) {
      return rejectWithValue('Failed to load cart');
    }
  }
);

export const addToCart = createAsyncThunk<void, Product, { rejectValue: string }>(
  'cart/addToCart',
  async (product, { rejectWithValue }) => {
    try {
      const useCase = container.addToCartUseCase;
      await useCase.execute(product);
    } catch (error) {
      return rejectWithValue('Failed to add to cart');
    }
  }
);

export const removeFromCart = createAsyncThunk<void, number, { rejectValue: string }>(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const useCase = container.removeFromCartUseCase;
      await useCase.execute(productId);
    } catch (error) {
      return rejectWithValue('Failed to remove from cart');
    }
  }
);

export const updateQuantity = createAsyncThunk<
  void,
  { productId: number; quantity: number },
  { rejectValue: string }
>(
  'cart/updateQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const useCase = container.updateCartQuantityUseCase;
      await useCase.execute({ productId, quantity });
    } catch (error) {
      return rejectWithValue('Failed to update quantity');
    }
  }
);

export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const useCase = container.clearCartUseCase;
      await useCase.execute();
    } catch (error) {
      return rejectWithValue('Failed to clear cart');
    }
  }
);
