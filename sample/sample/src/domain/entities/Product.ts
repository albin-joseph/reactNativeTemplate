/**
 * Domain Layer - Product Entity
 * Pure domain model without external dependencies
 */

export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  readonly id: number;
  readonly title: string;
  readonly price: number;
  readonly description: string;
  readonly category: string;
  readonly image: string;
  readonly rating: Rating;
}

export interface ProductFilters {
  searchQuery?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
}
