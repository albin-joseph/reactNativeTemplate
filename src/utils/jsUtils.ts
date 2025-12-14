/**
 * Essential JavaScript Utilities for Interviews
 * These are must-know implementations that demonstrate:
 * - Closure mastery
 * - Async control flow
 * - Performance optimization
 */

// ============================================
// 1. DEBOUNCE (Very Common in Interviews)
// ============================================

/**
 * Debounce delays execution until after a quiet period
 * Use case: Search input, window resize, form validation
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(1) - only stores one timeout reference
 * 
 * @example
 * const debouncedSearch = debounce((query) => api.search(query), 300);
 * input.onChange(debouncedSearch);
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    // Preserve 'this' context
    const context = this;

    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// ============================================
// 2. THROTTLE (Must-Know)
// ============================================

/**
 * Throttle ensures function executes at most once per interval
 * Use case: Scroll events, button clicks, API calls
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 * 
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 * scrollView.onScroll(throttledScroll);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastResult: any;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (!inThrottle) {
      lastResult = func.apply(context, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }

    return lastResult;
  };
}

// ============================================
// 3. PROMISE POOL (Senior-Level Question)
// ============================================

/**
 * Controls concurrency for async operations
 * Critical for managing API rate limits, resource constraints
 * 
 * Time Complexity: O(n) where n is array length
 * Space Complexity: O(concurrency) - only holds active promises
 * 
 * @example
 * const urls = ['url1', 'url2', ...]; // 100 URLs
 * const results = await promisePool(
 *   urls.map(url => () => fetch(url)),
 *   5 // Only 5 concurrent requests
 * );
 */
export async function promisePool<T>(
  promiseFns: Array<() => Promise<T>>,
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const [index, promiseFn] of promiseFns.entries()) {
    const promise = Promise.resolve()
      .then(() => promiseFn())
      .then(result => {
        results[index] = result;
      });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

// ============================================
// 4. MEMOIZATION (Common Follow-up)
// ============================================

/**
 * Caches expensive function results
 * Time Complexity: O(1) for cached calls, O(n) for new calls
 * Space Complexity: O(k) where k is number of unique inputs
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T
): T & { cache: Map<string, ReturnType<T>> } {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  } as T & { cache: Map<string, ReturnType<T>> };

  memoized.cache = cache;
  return memoized;
}

// ============================================
// 5. DEEP CLONE (Array/Object Manipulation)
// ============================================

/**
 * Creates deep copy of objects/arrays
 * Handles nested structures, prevents reference sharing
 * 
 * @example
 * const cloned = deepClone(complexObject);
 * cloned.nested.value = 'changed'; // Original unchanged
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  const cloned: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// ============================================
// 6. FLATTEN ARRAY (Common Question)
// ============================================

/**
 * Flattens nested arrays to specified depth
 * Time Complexity: O(n) where n is total elements
 * Space Complexity: O(d) where d is max depth (recursion stack)
 */
export function flatten<T>(arr: any[], depth: number = Infinity): T[] {
  if (depth === 0) {
    return arr;
  }

  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flatten(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

// ============================================
// 7. GROUP BY (Data Transformation)
// ============================================

/**
 * Groups array elements by key function
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 * 
 * @example
 * const users = [{age: 25, name: 'John'}, {age: 25, name: 'Jane'}];
 * groupBy(users, u => u.age); // {25: [{age: 25, name: 'John'}, ...]}
 */
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

// ============================================
// 8. RETRY WITH EXPONENTIAL BACKOFF
// ============================================

/**
 * Retries failed async operations with increasing delays
 * Critical for network resilience
 * 
 * @example
 * const data = await retry(() => fetchAPI(), { maxRetries: 3, baseDelay: 1000 });
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries: number;
    baseDelay: number;
    maxDelay?: number;
  }
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay = 30000 } = options;
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}
