import React, { useEffect, useCallback, useState, useMemo } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ListRenderItem,
  TextInput,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { fetchProducts } from "./productsThunk";
import ProductItem from "./component/productItem";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
import { Product } from "./productsType";
import ErrorBoundary from "../../components/ErrorBoundary";
import { setSearchQuery, setSelectedCategory, setPriceRange } from "./productsSlice";
import { debounce } from "../../utils/debounce";

/* ------------------------------
   Constants
------------------------------- */
const FLATLIST_CONFIG = {
  INITIAL_RENDER: 10,
  BATCH_SIZE: 10,
  WINDOW_SIZE: 5,
  BATCH_PERIOD: 50,
  END_THRESHOLD: 0.6,
  ITEM_HEIGHT: 110, // Approximate height for getItemLayout
};

const ProductsListScreenContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOffline } = useNetworkStatus();
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const {
    items,
    loading,
    isRefreshing,
    error,
    page,
    limit,
    hasMore,
    isFetchingMore,
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
  } = useAppSelector((state) => state.products);

  /* ------------------------------
     Debounced Search Handler
  ------------------------------- */
  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        dispatch(setSearchQuery(query));
      }, 500),
    [dispatch]
  );

  const handleSearchChange = useCallback((text: string) => {
    setLocalSearchQuery(text);
    debouncedSearch(text);
  }, [debouncedSearch]);

  /* ------------------------------
     Filter Handlers
  ------------------------------- */
  const handleCategoryChange = useCallback((category: string) => {
    dispatch(setSelectedCategory(category));
  }, [dispatch]);

  const handlePriceRangeChange = useCallback((min: number, max: number) => {
    dispatch(setPriceRange({ min, max }));
  }, [dispatch]);

  /* ------------------------------
     Filter Products (Client-side)
  ------------------------------- */
  const filteredItems = useMemo(() => {
    return items.filter((product) => {
      const matchesSearch = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;

      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [items, searchQuery, selectedCategory, minPrice, maxPrice]);

  /* ------------------------------
     Get Unique Categories
  ------------------------------- */
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
    return ['All', ...uniqueCategories];
  }, [items]);

  /* ------------------------------
     Initial Load (Online only)
  ------------------------------- */
  useEffect(() => {
    if (items.length === 0 && !isOffline) {
      dispatch(fetchProducts({ page: 0, limit }));
    }
  }, [dispatch, items.length, limit, isOffline]);

  /* ------------------------------
     Load More (Pagination)
  ------------------------------- */
  const loadMore = useCallback(() => {
    if (isOffline || loading || isFetchingMore || !hasMore) {
      return;
    }
    dispatch(fetchProducts({ page, limit }));
  }, [dispatch, loading, isFetchingMore, hasMore, page, limit, isOffline]);

  /* ------------------------------
     Pull To Refresh
  ------------------------------- */
  const onRefresh = useCallback(() => {
    if (!isOffline) {
      dispatch(fetchProducts({ page: 0, limit }));
    }
  }, [dispatch, limit, isOffline]);

  /* ------------------------------
     Retry Error
  ------------------------------- */
  const handleRetry = useCallback(() => {
    dispatch(fetchProducts({ page: 0, limit }));
  }, [dispatch, limit]);

  /* ------------------------------
     Key Extractor (Memoized)
  ------------------------------- */
  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  /* ------------------------------
     Render Item (Properly Typed)
  ------------------------------- */
  const renderItem: ListRenderItem<Product> = useCallback(
    ({ item }) => <ProductItem item={item} />,
    []
  );

  /* ------------------------------
     Get Item Layout (Performance)
  ------------------------------- */
  const getItemLayout = useCallback(
    (_data: ArrayLike<Product> | null | undefined, index: number) => ({
      length: FLATLIST_CONFIG.ITEM_HEIGHT,
      offset: FLATLIST_CONFIG.ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  /* ------------------------------
     Footer Loader
  ------------------------------- */
  const renderFooter = useCallback(() => {
    if (!isFetchingMore || isOffline) return null;
    return (
      <View
        style={styles.footer}
        accessibilityLabel="Loading more products"
        accessibilityRole="progressbar"
      >
        <ActivityIndicator size="small" />
      </View>
    );
  }, [isFetchingMore, isOffline]);

  /* ------------------------------
     Empty State
  ------------------------------- */
  const renderEmptyState = useCallback(() => {
    if (loading) return null;

    return (
      <View
        style={styles.emptyContainer}
        accessibilityRole="text"
        accessibilityLabel="No products available"
      >
        <Text style={styles.emptyTitle}>No Products Found</Text>
        <Text style={styles.emptySubtitle}>
          {isOffline
            ? "You're offline and there are no cached products"
            : "Try refreshing to load products"}
        </Text>
        {!isOffline && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
            accessibilityRole="button"
            accessibilityLabel="Retry loading products"
            accessibilityHint="Tap to retry loading products"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [loading, isOffline, handleRetry]);

  /* ------------------------------
     Dismiss Banner
  ------------------------------- */
  const dismissBanner = useCallback(() => {
    setIsBannerDismissed(true);
  }, []);

  /* ------------------------------
     Reset Banner on Connection Change
  ------------------------------- */
  useEffect(() => {
    if (!isOffline) {
      setIsBannerDismissed(false);
    }
  }, [isOffline]);

  /* ------------------------------
     Initial Loading
  ------------------------------- */
  if (loading && items.length === 0) {
    return (
      <View
        style={styles.center}
        accessibilityRole="progressbar"
        accessibilityLabel="Loading products"
      >
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  /* ------------------------------
     Error State
  ------------------------------- */
  if (error && items.length === 0) {
    return (
      <View
        style={styles.center}
        accessibilityRole="alert"
        accessibilityLabel={`Error: ${error}`}
      >
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={handleRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry loading products"
          accessibilityHint="Tap to retry loading products"
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ------------------------------
     Main Render
  ------------------------------- */
  return (
    <View style={styles.container}>
      {/* Offline Banner */}
      {isOffline && !isBannerDismissed && (
        <View
          style={styles.offlineBanner}
          accessibilityRole="alert"
          accessibilityLabel={`You are offline. Showing ${items.length} cached items.`}
        >
          <Text style={styles.offlineText}>
            You are offline. Showing {items.length} cached items.
          </Text>
          <TouchableOpacity
            onPress={dismissBanner}
            style={styles.dismissButton}
            accessibilityRole="button"
            accessibilityLabel="Dismiss offline banner"
            accessibilityHint="Tap to dismiss this notification"
          >
            <Text style={styles.dismissButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={localSearchQuery}
          onChangeText={handleSearchChange}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={styles.filterToggleButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterToggleText}>{showFilters ? '▲ Filters' : '▼ Filters'}</Text>
        </TouchableOpacity>
      </View>

      {/* Filters Section */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Category:</Text>
            <View style={styles.categoryButtons}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    (selectedCategory === cat || (cat === 'All' && !selectedCategory)) && styles.categoryButtonActive,
                  ]}
                  onPress={() => handleCategoryChange(cat === 'All' ? '' : cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      (selectedCategory === cat || (cat === 'All' && !selectedCategory)) && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Price Range: ${minPrice} - ${maxPrice}</Text>
            <View style={styles.priceRangeButtons}>
              <TouchableOpacity
                style={styles.priceButton}
                onPress={() => handlePriceRangeChange(0, 50)}
              >
                <Text style={styles.priceButtonText}>$0-$50</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.priceButton}
                onPress={() => handlePriceRangeChange(50, 200)}
              >
                <Text style={styles.priceButtonText}>$50-$200</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.priceButton}
                onPress={() => handlePriceRangeChange(200, 10000)}
              >
                <Text style={styles.priceButtonText}>$200+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.priceButton}
                onPress={() => handlePriceRangeChange(0, 10000)}
              >
                <Text style={styles.priceButtonText}>All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Pagination Info */}
      {items.length > 0 && (
        <View style={styles.paginationContainer}>
          <Text style={styles.paginationText}>
            Page {page > 0 ? page : 1} • Showing {filteredItems.length} of {items.length} items
          </Text>
        </View>
      )}

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={filteredItems.length === 0 ? styles.emptyList : styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={FLATLIST_CONFIG.END_THRESHOLD}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        getItemLayout={getItemLayout}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            accessibilityLabel="Pull to refresh products"
          />
        }
        /* -------- Performance Props -------- */
        initialNumToRender={FLATLIST_CONFIG.INITIAL_RENDER}
        maxToRenderPerBatch={FLATLIST_CONFIG.BATCH_SIZE}
        windowSize={FLATLIST_CONFIG.WINDOW_SIZE}
        removeClippedSubviews
        updateCellsBatchingPeriod={FLATLIST_CONFIG.BATCH_PERIOD}
        /* -------- Accessibility -------- */
        accessibilityRole="list"
        accessibilityLabel="Products list"
      />
    </View>
  );
};

/* ------------------------------
   Wrap with Error Boundary
------------------------------- */
const ProductsListScreen: React.FC = () => {
  return (
    <ErrorBoundary>
      <ProductsListScreenContent />
    </ErrorBoundary>
  );
};

ProductsListScreen.displayName = "ProductsListScreen";

export default React.memo(ProductsListScreen);

/* ------------------------------
   Styles
------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  list: {
    paddingVertical: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  offlineBanner: {
    backgroundColor: "#FFE082",
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  offlineText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
  dismissButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#000",
  },
  filterToggleButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  filterToggleText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  filtersContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryButtonText: {
    fontSize: 12,
    color: "#666",
  },
  categoryButtonTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  priceRangeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  priceButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  priceButtonText: {
    fontSize: 12,
    color: "#666",
  },
  paginationContainer: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },
  paginationText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
});
