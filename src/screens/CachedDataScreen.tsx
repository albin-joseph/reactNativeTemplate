/**
 * Cached Data Screen
 * 
 * Demonstrates:
 * - Cache-then-network strategy
 * - Stale-while-revalidate pattern
 * - Offline support
 * - AsyncStorage integration
 * - Background revalidation
 * 
 * This demonstrates SENIOR-LEVEL understanding of caching
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { cacheWithRevalidation, cache } from '../services/cache';
import { api } from '../services/api';
import { Post } from '../types';

export const CachedDataScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);

  /**
   * INTERVIEW TALKING POINTS:
   * 
   * Cache Strategy: Stale-While-Revalidate
   * 
   * Flow:
   * 1. Check cache first (instant response)
   * 2. Return cached data immediately if available
   * 3. If data is stale, fetch fresh data in background
   * 4. Update cache and UI when fresh data arrives
   * 
   * Benefits:
   * - Instant perceived performance
   * - Always shows something to user
   * - Keeps data fresh in background
   * - Works offline
   * 
   * Trade-offs:
   * - User might see stale data briefly
   * - Increased complexity
   * - Need cache invalidation strategy
   */

  /**
   * Load data with cache
   */
  const loadData = useCallback(async (showLoading: boolean = true) => {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const result = await cacheWithRevalidation(
        'posts-page-1',
        () => api.fetchPosts(1, 10),
        {
          ttl: 60000, // 1 minute TTL
          staleWhileRevalidate: true,
        }
      );

      setPosts(result.data.data);
      setIsStale(result.isStale);

      // Update cache size
      const size = await cache.getSize();
      setCacheSize(size);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Initial load
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  /**
   * Force refresh (bypasses cache)
   */
  const handleForceRefresh = useCallback(async () => {
    // Clear specific cache entry
    await cache.remove('posts-page-1');
    loadData(true);
  }, [loadData]);

  /**
   * Clear all cache
   */
  const handleClearCache = useCallback(async () => {
    await cache.clear();
    const size = await cache.getSize();
    setCacheSize(size);
    Alert.alert('Success', 'Cache cleared successfully');
  }, []);

  /**
   * INTERVIEW DISCUSSION POINTS:
   * 
   * Q: When would you NOT use caching?
   * A: - Real-time data (stock prices, live scores)
   *    - User-specific sensitive data
   *    - Data that changes frequently
   * 
   * Q: How do you handle cache invalidation?
   * A: - Time-based (TTL)
   *    - Event-based (on user action)
   *    - Version-based (cache key includes version)
   * 
   * Q: What about cache size limits?
   * A: - Monitor with getSize()
   *    - Implement LRU eviction
   *    - Set maximum entries limit
   * 
   * Q: How to sync cache across app restarts?
   * A: - AsyncStorage persists automatically
   *    - Check timestamps on startup
   *    - Revalidate stale entries
   */

  return (
    <View style={styles.container}>
      {/* Header with cache info */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>Cache Status</Text>
          <View style={[styles.badge, isStale ? styles.staleBadge : styles.freshBadge]}>
            <Text style={styles.badgeText}>
              {isStale ? 'Stale (Updating...)' : 'Fresh'}
            </Text>
          </View>
        </View>
        <Text style={styles.subHeader}>Cached entries: {cacheSize}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading from cache...</Text>
          </View>
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.card}>
              <Text style={styles.cardTitle}>{post.title}</Text>
              <Text style={styles.cardBody} numberOfLines={3}>
                {post.body}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.metaText}>❤️ {post.likes}</Text>
                <Text style={styles.metaText}>💬 {post.comments}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => loadData(false)}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Reload (Use Cache)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleForceRefresh}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Force Refresh
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={handleClearCache}
        >
          <Text style={styles.buttonText}>Clear Cache</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  subHeader: {
    fontSize: 14,
    color: '#666666',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  staleBadge: {
    backgroundColor: '#FFF3CD',
  },
  freshBadge: {
    backgroundColor: '#D4EDDA',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#999999',
  },
  actions: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
});

/**
 * CACHE METRICS TO DISCUSS:
 * 
 * 1. Hit Rate:
 *    - Measure: (cache hits) / (total requests)
 *    - Target: >80% for frequently accessed data
 * 
 * 2. Freshness:
 *    - TTL: 60 seconds (configurable)
 *    - Revalidation: Background, non-blocking
 * 
 * 3. Storage:
 *    - AsyncStorage limit: ~6MB on iOS, ~10MB on Android
 *    - Each post: ~1KB
 *    - Max entries: ~1000 posts
 */

/**
 * ADVANCED PATTERNS TO MENTION:
 * 
 * 1. Cache-aside (Lazy Loading):
 *    - Check cache first
 *    - On miss, fetch from API
 *    - Write to cache
 * 
 * 2. Write-through:
 *    - Write to cache and API simultaneously
 *    - Ensures consistency
 * 
 * 3. Write-behind:
 *    - Write to cache immediately
 *    - Sync to API asynchronously
 *    - Better performance, eventual consistency
 */
