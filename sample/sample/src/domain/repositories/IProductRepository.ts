/**
 * Domain Layer - Product Repository Interface
 * Defines the contract for product data operations
 */

import { Product, ProductFilters, PaginationParams, PaginatedResponse } from '../entities/Product';

export interface IProductRepository {
  /**
   * Fetch products with pagination and optional filters
   */
  getProducts(
    params: PaginationParams,
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>>;

  /**
   * Fetch a single product by ID
   */
  getProductById(id: number): Promise<Product | null>;

  /**
   * Get cached products (offline support)
   */
  getCachedProducts(): Promise<Product[]>;

  /**
   * Cache products for offline use
   */
  cacheProducts(products: Product[]): Promise<void>;
}
