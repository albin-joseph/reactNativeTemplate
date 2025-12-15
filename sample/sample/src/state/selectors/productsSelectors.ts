/**
 * State Layer - Products Selectors
 * Reusable selectors for accessing products state
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

// Base selectors
export const selectProductsState = (state: RootState) => state.products;

// Memoized selectors
export const selectProducts = createSelector(
  [selectProductsState],
  (productsState) => productsState.items
);

export const selectProductsLoading = createSelector(
  [selectProductsState],
  (productsState) => productsState.loading
);

export const selectProductsRefreshing = createSelector(
  [selectProductsState],
  (productsState) => productsState.isRefreshing
);

export const selectProductsError = createSelector(
  [selectProductsState],
  (productsState) => productsState.error
);

export const selectProductsHasMore = createSelector(
  [selectProductsState],
  (productsState) => productsState.hasMore
);

export const selectProductsFetchingMore = createSelector(
  [selectProductsState],
  (productsState) => productsState.isFetchingMore
);

export const selectProductsPage = createSelector(
  [selectProductsState],
  (productsState) => productsState.page
);

export const selectProductsLimit = createSelector(
  [selectProductsState],
  (productsState) => productsState.limit
);

export const selectProductsFilters = createSelector(
  [selectProductsState],
  (productsState) => ({
    searchQuery: productsState.searchQuery,
    selectedCategory: productsState.selectedCategory,
    minPrice: productsState.minPrice,
    maxPrice: productsState.maxPrice,
  })
);

export const selectProductById = (productId: number) =>
  createSelector([selectProducts], (products) =>
    products.find((p: any) => p.id === productId)
  );
