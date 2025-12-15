import { createSlice } from "@reduxjs/toolkit";
import { ProductsState } from "./productsType";
import { fetchProducts } from "./productsThunk";

const initialState: ProductsState = {
  items: [],
  loading: false,
  isRefreshing: false,
  error: null,

  page: 0,
  limit: 10,
  hasMore: true,
  isFetchingMore: false,
  searchQuery: '',
  selectedCategory: '',
  minPrice: 0,
  maxPrice: 10000,
};

const productsSlice = createSlice({
  name: "products",
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
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.page = 0;
      state.items = [];
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
      state.page = 0;
      state.items = [];
    },
    setPriceRange(state, action) {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
      state.page = 0;
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      /* -------------------------
         FETCH PRODUCTS - PENDING
      -------------------------- */
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

      /* -------------------------
         FETCH PRODUCTS - SUCCESS
      -------------------------- */
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.isRefreshing = false;
        state.isFetchingMore = false;
        state.error = null;

        const isRefresh = action.meta.arg.page === 0 && state.items.length > 0;
        const isInitialLoad = action.meta.arg.page === 0 && state.items.length === 0;

        if (isRefresh || isInitialLoad) {
          /* Replace all items on refresh or initial load */
          state.items = action.payload;
          state.page = 1;
        } else {
          /* Deduplicate by product ID for pagination */
          const existingIds = new Set(state.items.map((p) => p.id));
          const newItems = action.payload.filter(
            (item) => !existingIds.has(item.id)
          );
          state.items = [...state.items, ...newItems];
          state.page = action.meta.arg.page + 1;
        }

        state.hasMore = action.payload.length === state.limit;
      })

      /* -------------------------
         FETCH PRODUCTS - ERROR
      -------------------------- */
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.isRefreshing = false;
        state.isFetchingMore = false;
        state.error = action.payload || "Error fetching products";
      });
  },
});

export const { clearProducts, setSearchQuery, setSelectedCategory, setPriceRange } = productsSlice.actions;
export default productsSlice.reducer;
