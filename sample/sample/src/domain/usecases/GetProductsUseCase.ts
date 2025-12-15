/**
 * Domain Layer - Get Products Use Case
 * Business logic for fetching products
 */

import { UseCase } from './UseCase';
import { IProductRepository } from '../repositories/IProductRepository';
import { Product, ProductFilters, PaginationParams, PaginatedResponse } from '../entities/Product';

export interface GetProductsParams {
  pagination: PaginationParams;
  filters?: ProductFilters;
  useCache?: boolean;
}

export class GetProductsUseCase extends UseCase<GetProductsParams, PaginatedResponse<Product>> {
  constructor(private productRepository: IProductRepository) {
    super();
  }

  async execute(params: GetProductsParams): Promise<PaginatedResponse<Product>> {
    const { pagination, filters, useCache } = params;

    try {
      // Fetch from API
      const result = await this.productRepository.getProducts(pagination, filters);

      // Cache first page for offline use
      if (pagination.page === 0 && result.data.length > 0) {
        await this.productRepository.cacheProducts(result.data);
      }

      return result;
    } catch (error) {
      // Fallback to cache if requested and available
      if (useCache && pagination.page === 0) {
        const cachedProducts = await this.productRepository.getCachedProducts();
        return {
          data: cachedProducts,
          hasMore: false,
        };
      }
      throw error;
    }
  }
}
