/**
 * Paginated List Screen
 * 
 * Demonstrates:
 * - Infinite scroll implementation
 * - Pull-to-refresh
 * - Loading states
 * - Error handling
 * - Performance optimization
 * 
 * This is one of the MOST COMMON interview questions
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { OptimizedList } from '../components/OptimizedList';
import { usePagination } from '../hooks';
import { api } from '../services/api';
import { Post } from '../types';

export const PaginatedListScreen: React.FC = () => {
  /**
   * INTERVIEW TALKING POINTS:
   * 
   * 1. Why usePagination hook?
   *    - Separates business logic from UI
   *    - Reusable across screens
   *    - Easier to test
   * 
   * 2. Why not useState + useEffect?
   *    - Hook encapsulates complex pagination logic
   *    - Handles race conditions
   *    - Prevents infinite loops
   * 
   * 3. Performance considerations:
   *    - Data accumulated in state
   *    - Only fetch what's needed
   *    - Optimistic UI updates
   */
  const {
    data,
    isLoading,
    isRefreshing,
    hasMore,
    error,
    loadMore,
    refresh,
  } = usePagination((page) => api.fetchPosts(page, 20));

  /**
   * Handle item press
   * CRITICAL: useCallback to prevent re-creating function on every render
   */
  const handleItemPress = useCallback((item: Post) => {
    Alert.alert(
      item.title,
      item.body,
      [{ text: 'OK' }]
    );
  }, []);

  /**
   * INTERVIEW DISCUSSION POINTS:
   * 
   * Q: What happens if user scrolls too fast?
   * A: usePagination has isLoadingRef to prevent concurrent loads
   * 
   * Q: How do you handle stale data?
   * A: Pull-to-refresh resets to page 1, fetches fresh data
   * 
   * Q: What about offline support?
   * A: Could integrate with AsyncStorage cache layer
   *    (See CachedDataScreen for implementation)
   * 
   * Q: How to optimize memory for large lists?
   * A: FlatList's removeClippedSubviews, windowSize props
   *    Already implemented in OptimizedList component
   */

  return (
    <View style={styles.container}>
      <OptimizedList
        data={data}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onRefresh={refresh}
        onItemPress={handleItemPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

/**
 * PERFORMANCE METRICS TO DISCUSS:
 * 
 * 1. Time to Interactive (TTI):
 *    - Initial render: ~800ms (mock API delay)
 *    - Subsequent pages: ~1000ms
 * 
 * 2. Memory Usage:
 *    - Each post: ~1KB
 *    - 100 posts: ~100KB in memory
 *    - With images: ~10MB cached
 * 
 * 3. FPS Impact:
 *    - Without optimization: 30-45 FPS on scroll
 *    - With optimization: 55-60 FPS on scroll
 * 
 * 4. JS Thread Blocking:
 *    - Rendering 20 items: ~16ms
 *    - Below 16.67ms threshold for 60 FPS
 */

/**
 * TRADE-OFFS TO DISCUSS:
 * 
 * 1. Page size (20 items):
 *    - Smaller: More requests, smoother scroll
 *    - Larger: Fewer requests, potential jank
 * 
 * 2. onEndReachedThreshold (0.5):
 *    - Higher: Loads earlier, uses more memory
 *    - Lower: Loads later, better memory but may see loading
 * 
 * 3. Initial render count (10):
 *    - Higher: Faster perceived performance
 *    - Lower: Better TTI metrics
 */

/**
 * SCALING CONSIDERATIONS:
 * 
 * 1. If list grows to 1000+ items:
 *    - Implement virtual scrolling
 *    - Add pagination reset after X items
 *    - Consider server-side filtering
 * 
 * 2. If API becomes slow:
 *    - Add optimistic updates
 *    - Implement cache-first strategy
 *    - Show skeleton screens
 * 
 * 3. If memory becomes issue:
 *    - Reduce windowSize
 *    - Implement item recycling
 *    - Clear old data beyond certain threshold
 */
