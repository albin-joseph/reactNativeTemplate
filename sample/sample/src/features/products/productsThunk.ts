import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../api/axiosInstance";
import { Product } from "./productsType";
import { loadFromStorage, saveToStorage } from "../../utils/storage";
import { STORAGE_KEYS } from "../../utils/storageKeys";

interface FetchProductsArgs {
  page: number;
  limit: number;
}

export const fetchProducts = createAsyncThunk<
  Product[],
  FetchProductsArgs,
  { rejectValue: string }
>(
  "products/fetchProducts",
  async ({ page, limit }, { rejectWithValue, signal }) => {
    try {
      const skip = page * limit;
      const response = await axiosInstance.get<Product[]>(
        `/products?limit=${limit}&skip=${skip}`,
        { signal }
      );

      // Save latest successful data
      if (page === 0) {
        await saveToStorage(STORAGE_KEYS.PRODUCTS, response.data);
      }

      return response.data;
    } catch {
      // Handle abort
      if (signal.aborted) {
        return rejectWithValue("Request cancelled");
      }

      // Offline fallback (ONLY for first page)
      if (page === 0) {
        const cached = await loadFromStorage<Product[]>(STORAGE_KEYS.PRODUCTS);
        if (cached) {
          return cached;
        }
      }

      return rejectWithValue("Failed to fetch products");
    }
  }
);
