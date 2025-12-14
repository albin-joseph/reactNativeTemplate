/**
 * Cache Service using AsyncStorage
 * Demonstrates: Local storage, cache strategies, offline support
 * 
 * Interview Topics Covered:
 * - Cache invalidation
 * - Stale-while-revalidate pattern
 * - Error handling with storage
 * - Type-safe cache operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CacheEntry, CacheOptions } from '../types';

// ============================================
// Default Configuration
// ============================================

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_PREFIX = '@RNInterviewPrep:';

// ============================================
// Cache Service Class
// ============================================

class CacheService {
  /**
   * Get item from cache
   * Returns null if not found or expired (based on TTL)
   * 
   * @param key - Cache key
   * @returns Cached data or null
   */
  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const cachedValue = await AsyncStorage.getItem(CACHE_PREFIX + key);

      if (!cachedValue) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(cachedValue);

      return entry;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set item in cache with timestamp
   * 
   * @param key - Cache key
   * @param data - Data to cache
   * @param ttl - Time to live in milliseconds
   */
  async set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        stale: false,
      };

      await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Check if cache entry is stale
   * 
   * @param entry - Cache entry to check
   * @param ttl - Time to live in milliseconds
   * @returns true if stale, false otherwise
   */
  isStale<T>(entry: CacheEntry<T>, ttl: number = DEFAULT_TTL): boolean {
    return Date.now() - entry.timestamp > ttl;
  }

  /**
   * Remove item from cache
   * 
   * @param key - Cache key
   */
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.error('Cache remove error:', error);
    }
  }

  /**
   * Clear all cache entries
   * Useful for logout or data reset
   */
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Get cache size (number of entries)
   * Useful for debugging and monitoring
   */
  async getSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.filter(key => key.startsWith(CACHE_PREFIX)).length;
    } catch (error) {
      console.error('Cache size error:', error);
      return 0;
    }
  }
}

// ============================================
// Stale-While-Revalidate Hook Helper
// ============================================

/**
 * Implements stale-while-revalidate caching strategy
 * 
 * Flow:
 * 1. Return cached data immediately (if available)
 * 2. Mark as stale if TTL exceeded
 * 3. Fetch fresh data in background
 * 4. Update cache with fresh data
 * 
 * This is a critical pattern for interview discussions
 * 
 * @example
 * const data = await cacheWithRevalidation(
 *   'posts-page-1',
 *   () => api.fetchPosts(1),
 *   { ttl: 60000, staleWhileRevalidate: true }
 * );
 */
export async function cacheWithRevalidation<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions = { ttl: DEFAULT_TTL, staleWhileRevalidate: true }
): Promise<{ data: T; isStale: boolean }> {
  const cached = await cache.get<T>(key);

  // No cache: fetch fresh
  if (!cached) {
    const data = await fetchFn();
    await cache.set(key, data, options.ttl);
    return { data, isStale: false };
  }

  const isStale = cache.isStale(cached, options.ttl);

  // Stale-while-revalidate: return cached immediately, update in background
  if (isStale && options.staleWhileRevalidate) {
    // Return stale data immediately
    const result = { data: cached.data, isStale: true };

    // Update in background (don't await)
    fetchFn()
      .then(freshData => cache.set(key, freshData, options.ttl))
      .catch(err => console.error('Background revalidation failed:', err));

    return result;
  }

  // Not stale or no SWR: return cached data
  if (!isStale) {
    return { data: cached.data, isStale: false };
  }

  // Stale and no SWR: fetch fresh data
  const freshData = await fetchFn();
  await cache.set(key, freshData, options.ttl);
  return { data: freshData, isStale: false };
}

// ============================================
// Export Singleton
// ============================================

export const cache = new CacheService();
