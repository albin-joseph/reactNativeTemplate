/**
 * State Layer - Products State Types
 */

import { Product } from '../../../domain/entities/Product';

export interface ProductsState {
  items: Product[];
  loading: boolean;
  isRefreshing: boolean;
  error: string | null;

  // Pagination
  page: number;
  limit: number;
  hasMore: boolean;
  isFetchingMore: boolean;

  // Filters
  searchQuery: string;
  selectedCategory: string;
  minPrice: number;
  maxPrice: number;
}
