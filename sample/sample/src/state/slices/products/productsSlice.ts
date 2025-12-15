/**
 * State Layer - Products Slice
 * Redux slice following clean architecture principles
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductsState } from './types';
import { fetchProducts, fetchProductById } from './thunks';
import { APP_CONSTANTS } from '../../../core/config/constants';

const initialState: ProductsState = {
  items: [],
  loading: false,
  isRefreshing: false,
  error: null,
  page: 0,
  limit: APP_CONSTANTS.DEFAULT_PAGE_SIZE,
  hasMore: true,
  isFetchingMore: false,
  searchQuery: '',
  selectedCategory: '',
  minPrice: 0,
  maxPrice: 10000,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts(state) {
      state.items = [];
      state.loading = false;
      state.isRefreshing = false;
      state.error = null;
      state.page = 0;
      state.hasMore = true;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 0;
      state.items = [];
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
      state.page = 0;
      state.items = [];
    },
    setPriceRange(state, action: PayloadAction<{ min: number; max: number }>) {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
      state.page = 0;
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products - Pending
      .addCase(fetchProducts.pending, (state, action) => {
        const isRefresh = action.meta.arg.page === 0 && state.items.length > 0;

        if (isRefresh) {
          state.isRefreshing = true;
        } else if (action.meta.arg.page === 0) {
          state.loading = true;
        } else {
          state.isFetchingMore = true;
        }
        state.error = null;
      })

      // Fetch Products - Fulfilled
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.isRefreshing = false;
        state.isFetchingMore = false;
        state.error = null;

        const isRefresh = action.meta.arg.page === 0 && state.items.length > 0;
        const isInitialLoad = action.meta.arg.page === 0 && state.items.length === 0;

        if (isRefresh || isInitialLoad) {
          state.items = action.payload.products;
          state.page = 1;
        } else {
          // Deduplicate
          const existingIds = new Set(state.items.map((p: any) => p.id));
          const newItems = action.payload.products.filter(
            (item) => !existingIds.has(item.id)
          );
          state.items = [...state.items, ...newItems];
          state.page = action.meta.arg.page + 1;
        }

        state.hasMore = action.payload.hasMore;
      })

      // Fetch Products - Rejected
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.isRefreshing = false;
        state.isFetchingMore = false;
        state.error = action.payload || 'Error fetching products';
      });
  },
});

export const { clearProducts, setSearchQuery, setSelectedCategory, setPriceRange } =
  productsSlice.actions;
export default productsSlice.reducer;
