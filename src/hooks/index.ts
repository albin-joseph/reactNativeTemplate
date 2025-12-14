/**
 * Custom Hooks for Interview Demonstrations
 * Shows: State management, useEffect patterns, error handling, performance
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AsyncState, PaginatedResponse } from '../types';
import { debounce } from '../utils/jsUtils';

// ============================================
// 1. ASYNC DATA FETCHING HOOK
// ============================================

/**
 * Generic hook for async data fetching with proper state management
 * 
 * Interview Points:
 * - Proper cleanup with useEffect
 * - Error handling
 * - Loading states
 * - Dependency management
 * 
 * @example
 * const { data, status, error, refetch } = useAsync(() => api.fetchPosts(1));
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  dependencies: any[] = []
): AsyncState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    status: 'idle',
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));

    try {
      const data = await asyncFn();
      setState({ data, status: 'success', error: null });
    } catch (error: any) {
      setState({
        data: null,
        status: 'error',
        error: {
          message: error.message || 'An error occurred',
          code: error.code || 'UNKNOWN_ERROR',
          status: error.status || 500,
        },
      });
    }
  }, [asyncFn]);

  useEffect(() => {
    execute();
  }, dependencies);

  return { ...state, refetch: execute };
}

// ============================================
// 2. PAGINATION HOOK (Very Common)
// ============================================

/**
 * Hook for infinite scroll / pagination
 * 
 * Interview Points:
 * - Accumulating data
 * - hasMore logic
 * - Race condition prevention
 * - Pull-to-refresh
 * 
 * @example
 * const { data, loadMore, refresh, isLoading, hasMore } = usePagination(
 *   (page) => api.fetchPosts(page, 20)
 * );
 */
export function usePagination<T>(
  fetchFn: (page: number) => Promise<PaginatedResponse<T>>
) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent multiple simultaneous loads
  const isLoadingRef = useRef(false);

  const loadPage = useCallback(
    async (pageNum: number, isRefresh: boolean = false) => {
      // Prevent concurrent loads
      if (isLoadingRef.current) return;

      isLoadingRef.current = true;
      isRefresh ? setIsRefreshing(true) : setIsLoading(true);
      setError(null);

      try {
        const response = await fetchFn(pageNum);

        setData(prev => (isRefresh ? response.data : [...prev, ...response.data]));
        setHasMore(response.hasMore);
        setPage(pageNum);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        isLoadingRef.current = false;
      }
    },
    [fetchFn]
  );

  // Initial load
  useEffect(() => {
    loadPage(1, false);
  }, []);

  // Load next page
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadPage(page + 1, false);
    }
  }, [isLoading, hasMore, page, loadPage]);

  // Pull to refresh
  const refresh = useCallback(() => {
    loadPage(1, true);
  }, [loadPage]);

  return {
    data,
    isLoading,
    isRefreshing,
    hasMore,
    error,
    loadMore,
    refresh,
  };
}

// ============================================
// 3. DEBOUNCED SEARCH HOOK
// ============================================

/**
 * Hook for debounced search with cancellation
 * 
 * Interview Points:
 * - Debouncing implementation
 * - Request cancellation
 * - Empty state handling
 * 
 * @example
 * const { results, isSearching, search } = useDebouncedSearch(
 *   (query) => api.searchPosts(query),
 *   300
 * );
 */
export function useDebouncedSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      try {
        const data = await searchFn(searchQuery);
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, delay),
    [searchFn, delay]
  );

  // Update query and trigger search
  const search = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      debouncedSearch(newQuery);
    },
    [debouncedSearch]
  );

  return { query, results, isSearching, search };
}

// ============================================
// 4. PREVIOUS VALUE HOOK (Useful Pattern)
// ============================================

/**
 * Tracks previous value of a variable
 * Useful for detecting changes and animations
 * 
 * @example
 * const prevCount = usePrevious(count);
 * const increased = count > prevCount;
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// ============================================
// 5. MOUNT STATUS HOOK
// ============================================

/**
 * Prevents state updates on unmounted components
 * Critical for preventing memory leaks
 * 
 * @example
 * const isMounted = useIsMounted();
 * asyncFn().then(data => {
 *   if (isMounted()) {
 *     setData(data);
 *   }
 * });
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}

// ============================================
// 6. INTERVAL HOOK (Timer Management)
// ============================================

/**
 * Manages setInterval with cleanup
 * 
 * @example
 * useInterval(() => {
 *   checkForUpdates();
 * }, 5000);
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
