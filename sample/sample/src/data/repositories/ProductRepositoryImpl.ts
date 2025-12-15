/**
 * Data Layer - Product Repository Implementation
 */

import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product, ProductFilters, PaginationParams, PaginatedResponse } from '../../domain/entities/Product';
import { IApiClient } from '../api/IApiClient';
import { IStorageService } from '../../platform/storage/IStorageService';
import { ProductDTO } from '../models/ProductDTO';
import { ProductMapper } from '../mappers/ProductMapper';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../core/config/constants';

export class ProductRepository implements IProductRepository {
  constructor(
    private apiClient: IApiClient,
    private storageService: IStorageService
  ) {}

  async getProducts(
    params: PaginationParams,
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> {
    const { page, limit } = params;
    const skip = page * limit;

    // Build query parameters
    const queryParams: Record<string, any> = {
      limit,
      skip,
    };

    // Note: FakeStore API doesn't support all filters, but we'll structure it properly
    const url = `${API_ENDPOINTS.PRODUCTS}`;

    try {
      const response = await this.apiClient.get<ProductDTO[]>(url, {
        params: queryParams,
      });

      let products = ProductMapper.toDomainList(response.data);

      // Apply client-side filtering (since API doesn't support it)
      if (filters) {
        products = this.applyFilters(products, filters);
      }

      return {
        data: products,
        hasMore: response.data.length === limit,
      };
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      const response = await this.apiClient.get<ProductDTO>(
        API_ENDPOINTS.PRODUCT_BY_ID(id)
      );
      return ProductMapper.toDomain(response.data);
    } catch (error) {
      return null;
    }
  }

  async getCachedProducts(): Promise<Product[]> {
    const cached = await this.storageService.get<ProductDTO[]>(STORAGE_KEYS.PRODUCTS);
    return cached ? ProductMapper.toDomainList(cached) : [];
  }

  async cacheProducts(products: Product[]): Promise<void> {
    const dtos = products.map((p) => ProductMapper.toDTO(p));
    await this.storageService.set(STORAGE_KEYS.PRODUCTS, dtos);
  }

  private applyFilters(products: Product[], filters: ProductFilters): Product[] {
    let filtered = products;

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    return filtered;
  }
}
