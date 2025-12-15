/**
 * Application Constants
 */

export const APP_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  
  // Cache
  CACHE_EXPIRY_MS: 5 * 60 * 1000, // 5 minutes
  
  // Network
  REQUEST_TIMEOUT: 10000,
  
  // UI
  DEBOUNCE_DELAY: 300,
  END_REACHED_THRESHOLD: 0.6,
} as const;

export const STORAGE_KEYS = {
  PRODUCTS: '@products',
  CART: '@cart',
  USER_PREFERENCES: '@user_preferences',
} as const;

export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,
  CATEGORIES: '/products/categories',
  PRODUCTS_BY_CATEGORY: (category: string) => `/products/category/${category}`,
} as const;
