# React Native Interview Cheat Sheet 📝

## 🚨 Critical First 5 Minutes

### 1. Clarify Requirements
```
✓ "Language: TypeScript or JavaScript?"
✓ "RN version? Expo vs CLI?"
✓ "Navigation library needed?"
✓ "State: local vs global?"
✓ "Error handling expected?"
✓ "Testing required?"
```

### 2. State Assumptions ALOUD
```
"I'll assume:
- TypeScript
- RN CLI
- Functional components
- Hooks (useState, useEffect)
- Simple mock API
- No Redux/Context needed"
```

---

## ⚡️ FlatList Performance Checklist

```typescript
// 1. Memoize row component
const Row = React.memo(({ item, onPress }) => { ... });

// 2. Stable callbacks
const keyExtractor = useCallback((item) => item.id, []);
const renderItem = useCallback(({ item }) => <Row item={item} />, []);

// 3. Performance props
<FlatList
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
  onEndReachedThreshold={0.5}
/>

// 4. Fixed height optimization (if applicable)
getItemLayout={(data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
})}
```

---

## 🪝 Essential Hooks Patterns

### useAsync (Generic Data Fetching)
```typescript
function useAsync<T>(asyncFn: () => Promise<T>, deps: any[]) {
  const [state, setState] = useState({ data: null, loading: false, error: null });

  useEffect(() => {
    let cancelled = false;
    setState(prev => ({ ...prev, loading: true }));
    
    asyncFn()
      .then(data => !cancelled && setState({ data, loading: false, error: null }))
      .catch(error => !cancelled && setState({ data: null, loading: false, error }));
    
    return () => { cancelled = true; };
  }, deps);

  return state;
}
```

### usePagination (Infinite Scroll)
```typescript
function usePagination(fetchFn) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    fetchFn(page + 1)
      .then(res => {
        setData(prev => [...prev, ...res.data]);
        setHasMore(res.hasMore);
        setPage(page + 1);
      })
      .finally(() => setLoading(false));
  }, [loading, hasMore, page]);

  return { data, loading, hasMore, loadMore };
}
```

---

## 🔥 Quick Algorithm Implementations

### Debounce (300ms standard)
```typescript
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### Throttle (100ms standard)
```typescript
function throttle<T extends (...args: any[]) => any>(fn: T, limit: number) {
  let inThrottle = false;
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

### Promise Pool (Concurrency Control)
```typescript
async function promisePool<T>(
  promiseFns: Array<() => Promise<T>>,
  concurrency: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const [i, fn] of promiseFns.entries()) {
    const p = fn().then(r => { results[i] = r; });
    executing.push(p);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(executing.findIndex(x => x === p), 1);
    }
  }

  await Promise.all(executing);
  return results;
}
```

---

## 📋 Form Validation Pattern

```typescript
interface FormData { email: string; password: string; }
interface FormErrors { email?: string; password?: string; }

const [form, setForm] = useState<FormData>({ email: '', password: '' });
const [errors, setErrors] = useState<FormErrors>({});

const validate = (): boolean => {
  const newErrors: FormErrors = {};
  
  if (!form.email) newErrors.email = 'Required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Invalid email';
  }
  
  if (!form.password) newErrors.password = 'Required';
  else if (form.password.length < 6) {
    newErrors.password = 'Min 6 characters';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) return;
  // Submit logic
};
```

---

## 🎯 TypeScript Quick Types

```typescript
// API Response
interface PaginatedResponse<T> {
  data: T[];
  page: number;
  total: number;
  hasMore: boolean;
}

// Async State
type LoadingState = 'idle' | 'loading' | 'success' | 'error';
interface AsyncState<T> {
  data: T | null;
  status: LoadingState;
  error: Error | null;
}

// Navigation (Critical!)
type RootStackParamList = {
  Home: undefined;
  Detail: { id: string };
};
```

---

## 🚨 Common Mistakes - AVOID!

### 1. Missing Dependencies
```typescript
// ❌ BAD
useEffect(() => { fetchData(userId); }, []);

// ✅ GOOD
useEffect(() => { fetchData(userId); }, [userId]);
```

### 2. Inline Functions in FlatList
```typescript
// ❌ BAD
<FlatList renderItem={({ item }) => <Row item={item} />} />

// ✅ GOOD
const renderItem = useCallback(({ item }) => <Row item={item} />, []);
<FlatList renderItem={renderItem} />
```

### 3. No Cleanup
```typescript
// ❌ BAD
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
}, []);

// ✅ GOOD
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
}, []);
```

---

## 💬 Key Discussion Points

### Performance
```
Q: "How to optimize FlatList?"
A: React.memo, useCallback, removeClippedSubviews, 
   windowSize, fixed getItemLayout

Q: "When does JS thread block?"
A: Heavy computations, large lists without optimization,
   synchronous operations
```

### State Management
```
Q: "When to use useReducer vs useState?"
A: useReducer for complex state logic, multiple sub-values,
   next state depends on previous
   
Q: "Context vs Redux?"
A: Context: simple sharing, infrequent updates
   Redux: complex state, time-travel, middleware
```

### Caching
```
Q: "How to implement offline support?"
A: AsyncStorage for persistence, stale-while-revalidate,
   cache-first strategy with background sync

Q: "Cache invalidation?"
A: TTL-based, event-based (on mutation),
   version-based keys
```

---

## 📊 Complexity Analysis

Always mention Time/Space complexity!

```
Array Transform:
- Time: O(n)
- Space: O(n)

Debounce/Throttle:
- Time: O(1) per call
- Space: O(1)

Promise Pool:
- Time: O(n)
- Space: O(concurrency)

Deep Clone:
- Time: O(n) where n = all nested values
- Space: O(d) where d = max depth
```

---

## 🎬 Interview Flow Template

```
0-5 min:   Clarify + Frame
5-40 min:  Core Implementation
40-50 min: Hardening + Edge Cases
50-60 min: Walkthrough + Trade-offs

During coding:
✓ Speak while typing
✓ Explain trade-offs
✓ Write small helpers
✓ Add comments for complex logic
```

---

## 🔑 Key Takeaways

**High-Impact Actions:**
1. ✅ Always use useCallback for render functions
2. ✅ Memoize list row components
3. ✅ Handle loading/error states
4. ✅ Clean up side effects
5. ✅ Type everything properly
6. ✅ Explain complexity

**Interview Winners:**
- Explaining WHY you chose an approach
- Discussing trade-offs unprompted
- Mentioning what you'd add with more time
- Showing performance awareness
- Clean, readable code

**Career Insights:**
- Senior roles expect architectural thinking
- Code quality > code quantity
- Communication skills matter as much as coding

---

## 📞 Emergency Quick Reference

**Stuck on FlatList?**
→ keyExtractor, renderItem (useCallback), React.memo

**Stuck on async?**
→ useState + useEffect + cleanup function

**Stuck on form?**
→ Controlled inputs, validation function, error state

**Stuck on performance?**
→ React.memo, useCallback, useMemo

**Stuck on types?**
→ Start with `any`, refine later in interview

---

**Print this. Keep it visible during interviews. Good luck! 🚀**
