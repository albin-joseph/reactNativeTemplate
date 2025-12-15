export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export interface ProductsState {
  items: Product[];
  loading: boolean;
  isRefreshing: boolean;
  error: string | null;

  page: number;
  limit: number;
  hasMore: boolean;
  isFetchingMore: boolean;
  searchQuery: string;
  selectedCategory: string;
  minPrice: number;
  maxPrice: number;
}

