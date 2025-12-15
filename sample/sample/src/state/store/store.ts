/**
 * State Layer - Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../slices/products/productsSlice';
import cartReducer from '../slices/cart/cartSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state for serialization checks
        ignoredActions: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
