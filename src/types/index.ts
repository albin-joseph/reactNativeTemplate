/**
 * Core API Types for Interview Preparation
 * Demonstrates proper typing for React Native applications
 */

// ============================================
// API Response Types
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

// ============================================
// State Management Types
// ============================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: ApiError | null;
}

// ============================================
// Navigation Types (Critical for Type Safety)
// ============================================

export type RootStackParamList = {
  Home: undefined;
  PaginatedList: undefined;
  CachedData: undefined;
  LoginForm: undefined;
  PerformanceDemo: undefined;
  JSChallenges: undefined;
};

// ============================================
// Form Types
// ============================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
}

// ============================================
// Utility Types (Demonstrate TypeScript Knowledge)
// ============================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Awaited<T> = T extends Promise<infer U> ? U : T;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// ============================================
// Cache Types
// ============================================

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  stale: boolean;
}

export interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  staleWhileRevalidate: boolean;
}
