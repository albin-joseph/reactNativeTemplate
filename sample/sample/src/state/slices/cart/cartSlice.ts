/**
 * State Layer - Cart Slice
 * Redux slice following clean architecture principles
 */

import { createSlice } from '@reduxjs/toolkit';
import { CartState } from './types';
import { loadCart, addToCart, removeFromCart, updateQuantity, clearCart } from './thunks';
import { calculateCartTotals } from '../../../domain/entities/Cart';

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load Cart
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        const totals = calculateCartTotals(action.payload);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
      })
      .addCase(loadCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load cart';
      })

      // Add to Cart
      .addCase(addToCart.fulfilled, (state) => {
        // After successful add, reload cart to get updated state
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload || 'Failed to add to cart';
      })

      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload || 'Failed to remove from cart';
      })

      // Update Quantity
      .addCase(updateQuantity.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update quantity';
      })

      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload || 'Failed to clear cart';
      });
  },
});

export default cartSlice.reducer;
