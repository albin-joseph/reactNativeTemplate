/**
 * State Layer - Cart Selectors
 * Reusable selectors for accessing cart state
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

// Base selector
export const selectCartState = (state: RootState) => state.cart;

// Memoized selectors
export const selectCartItems = createSelector(
  [selectCartState],
  (cartState) => cartState.items
);

export const selectCartTotalItems = createSelector(
  [selectCartState],
  (cartState) => cartState.totalItems
);

export const selectCartTotalPrice = createSelector(
  [selectCartState],
  (cartState) => cartState.totalPrice
);

export const selectCartLoading = createSelector(
  [selectCartState],
  (cartState) => cartState.loading
);

export const selectCartError = createSelector(
  [selectCartState],
  (cartState) => cartState.error
);

export const selectCartItemByProductId = (productId: number) =>
  createSelector([selectCartItems], (items) =>
    items.find((item: any) => item.product.id === productId)
  );

export const selectIsProductInCart = (productId: number) =>
  createSelector([selectCartItems], (items) =>
    items.some((item: any) => item.product.id === productId)
  );
