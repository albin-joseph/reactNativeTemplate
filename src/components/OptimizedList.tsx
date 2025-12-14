/**
 * Optimized FlatList Implementation
 * 
 * Interview Topics Demonstrated:
 * - FlatList performance optimization
 * - React.memo for row components
 * - useCallback for event handlers
 * - Proper keyExtractor
 * - Pull-to-refresh
 * - Infinite scroll
 * - Loading states
 * - Empty states
 */

import React, { useCallback, memo } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Post } from '../../types';

// ============================================
// TYPES
// ============================================

interface OptimizedListProps {
  data: Post[];
  isLoading: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
  onItemPress?: (item: Post) => void;
}

// ============================================
// MEMOIZED ROW COMPONENT (Critical for Performance)
// ============================================

/**
 * Individual list item component
 * 
 * Performance Points:
 * - Wrapped in React.memo to prevent unnecessary re-renders
 * - Only re-renders when item or onPress changes
 * - Avoid inline styles (defined outside)
 * - Avoid inline functions in props
 */
interface ListItemProps {
  item: Post;
  onPress: (item: Post) => void;
}

const ListItem = memo<ListItemProps>(({ item, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      )}

      <View style={styles.itemContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={3}>
          {item.body}
        </Text>

        <View style={styles.metadata}>
          <Text style={styles.metaText}>❤️ {item.likes}</Text>
          <Text style={styles.metaText}>💬 {item.comments}</Text>
          <Text style={styles.metaText}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

ListItem.displayName = 'ListItem';

// ============================================
// LOADING FOOTER COMPONENT
// ============================================

/**
 * Shows loading indicator at bottom when fetching more items
 */
const LoadingFooter = memo<{ isLoading: boolean }>(({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <View style={styles.footer}>
      <ActivityIndicator size="small" color="#007AFF" />
      <Text style={styles.footerText}>Loading more...</Text>
    </View>
  );
});

LoadingFooter.displayName = 'LoadingFooter';

// ============================================
// EMPTY STATE COMPONENT
// ============================================

/**
 * Shown when list is empty
 */
const EmptyState = memo(() => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No posts found</Text>
    <Text style={styles.emptySubtext}>Pull down to refresh</Text>
  </View>
));

EmptyState.displayName = 'EmptyState';

// ============================================
// OPTIMIZED FLATLIST COMPONENT
// ============================================

export const OptimizedList: React.FC<OptimizedListProps> = ({
  data,
  isLoading,
  isRefreshing,
  hasMore,
  onLoadMore,
  onRefresh,
  onItemPress = () => {},
}) => {
  /**
   * CRITICAL: keyExtractor must be stable and unique
   * Using item.id ensures consistent keys across renders
   */
  const keyExtractor = useCallback((item: Post) => item.id, []);

  /**
   * CRITICAL: renderItem must be useCallback to prevent re-creating
   * Pass memoized component with stable onPress callback
   */
  const renderItem = useCallback(
    ({ item }: { item: Post }) => <ListItem item={item} onPress={onItemPress} />,
    [onItemPress]
  );

  /**
   * CRITICAL: Footer component wrapped in useCallback
   */
  const renderFooter = useCallback(
    () => <LoadingFooter isLoading={isLoading && hasMore} />,
    [isLoading, hasMore]
  );

  /**
   * CRITICAL: Empty component wrapped in useCallback
   */
  const renderEmpty = useCallback(
    () => (!isLoading ? <EmptyState /> : null),
    [isLoading]
  );

  /**
   * Pull-to-refresh control
   */
  const refreshControl = (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      tintColor="#007AFF"
      colors={['#007AFF']}
    />
  );

  /**
   * Handle scroll to bottom (infinite scroll)
   * CRITICAL: Use onEndReachedThreshold carefully
   * 0.5 means trigger when 50% from bottom
   */
  const handleEndReached = useCallback(() => {
    if (!isLoading && hasMore) {
      onLoadMore();
    }
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      refreshControl={refreshControl}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      // PERFORMANCE OPTIMIZATIONS
      removeClippedSubviews={true} // Unmount off-screen items
      maxToRenderPerBatch={10} // Render 10 items per batch
      windowSize={10} // Items to render outside viewport
      initialNumToRender={10} // Initial render count
      updateCellsBatchingPeriod={50} // Batch updates every 50ms
      // VISUAL
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    />
  );
};

// ============================================
// STYLES (Defined Outside Component)
// ============================================

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0F0F0',
  },
  itemContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  metadata: {
    flexDirection: 'row',
    gap: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#999999',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
  },
});
