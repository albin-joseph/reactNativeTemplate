/**
 * State Layer - Products Thunks
 * Redux thunks using use cases from domain layer
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { container } from '../../../core/di/container';
import { Product } from '../../../domain/entities/Product';

interface FetchProductsArgs {
  page: number;
  limit: number;
  searchQuery?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  useCache?: boolean;
}

export const fetchProducts = createAsyncThunk<
  { products: Product[]; hasMore: boolean },
  FetchProductsArgs,
  { rejectValue: string }
>(
  'products/fetchProducts',
  async (args, { rejectWithValue, signal }) => {
    try {
      const { page, limit, searchQuery, category, minPrice, maxPrice, useCache } = args;

      const useCase = container.getProductsUseCase;
      
      const result = await useCase.execute({
        pagination: { page, limit },
        filters: {
          searchQuery,
          category,
          minPrice,
          maxPrice,
        },
        useCache: useCache || page === 0,
      });

      return {
        products: result.data,
        hasMore: result.hasMore,
      };
    } catch (error) {
      if (signal.aborted) {
        return rejectWithValue('Request cancelled');
      }
      return rejectWithValue('Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk<
  Product | null,
  number,
  { rejectValue: string }
>(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const useCase = container.getProductByIdUseCase;
      const product = await useCase.execute(productId);
      return product;
    } catch (error) {
      return rejectWithValue('Failed to fetch product details');
    }
  }
);
