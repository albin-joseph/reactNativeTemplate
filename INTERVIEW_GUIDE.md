# 1-Hour Live Coding Interview - Complete Strategy Guide

## 📋 Table of Contents
1. [Pre-Interview Preparation](#pre-interview-preparation)
2. [Interview Structure (60 Minutes)](#interview-structure)
3. [Common React Native Prompts](#common-prompts)
4. [JavaScript Challenges](#javascript-challenges)
5. [Discussion Topics](#discussion-topics)
6. [Red Flags to Avoid](#red-flags)
7. [Post-Interview](#post-interview)

---

## 🎯 Pre-Interview Preparation (48-72 Hours)

### Day 1: Core Implementations
**Morning (3 hours):**
- [ ] Implement paginated FlatList from scratch (timed: 45 min)
- [ ] Review: Why each optimization? What if removed?

**Afternoon (3 hours):**
- [ ] Build login form with validation (timed: 30 min)
- [ ] Implement debounce, throttle, promisePool (timed: 45 min)

**Evening (2 hours):**
- [ ] Study FlatList docs: https://reactnative.dev/docs/flatlist
- [ ] Review performance guide: https://reactnative.dev/docs/performance

### Day 2: Advanced Topics
**Morning (3 hours):**
- [ ] Implement stale-while-revalidate cache
- [ ] Build custom pagination hook
- [ ] Practice async state management

**Afternoon (3 hours):**
- [ ] TypeScript utility types practice
- [ ] Navigation param typing
- [ ] Error boundary implementation

**Evening (2 hours):**
- [ ] Read: RN threading model
- [ ] Review: Bridge communication
- [ ] Study: Startup performance

### Day 3: Mock Interviews
**Morning (2 hours):**
- [ ] Full mock interview (60 min)
- [ ] Self-review recording
- [ ] Note improvement areas

**Afternoon (2 hours):**
- [ ] Practice explaining code aloud
- [ ] Rehearse trade-off discussions
- [ ] Review complexity analysis

**Evening (1 hour):**
- [ ] Print CHEAT_SHEET.md
- [ ] Review README.md
- [ ] Relax, rest well

---

## ⏰ Interview Structure (60 Minutes)

### Phase 1: Clarify & Frame (0-5 min) 🎯
**CRITICAL: This sets the tone for entire interview**

**Template Script:**
```
"Before I start, let me clarify a few things:

1. Language: TypeScript or JavaScript? (Assume TS unless told otherwise)
2. React Native version? (Assume latest stable)
3. Navigation needed? (If yes, ask which library)
4. State management: Local or global? (Start local, mention scaling)
5. Error handling: How detailed? (Show awareness)
6. Testing: Required or focus on logic? (Be ready for both)

My assumptions:
- TypeScript for type safety
- React Native CLI (not Expo)
- Functional components with hooks
- Simple mock API for data
- Local state unless specified
- Focus on correctness first, optimization second

Does this align with what you're looking for?"
```

**Why This Matters:**
- Shows systematic thinking
- Prevents wasted time on wrong approach
- Demonstrates communication skills
- Gives interviewer chance to guide

---

### Phase 2: Core Implementation (5-40 min) 🔥
**This is where 70% of your score comes from**

#### 2A: Planning (5-7 min)
```
"Here's my approach:

1. [Draw/describe component tree]
2. [List state variables needed]
3. [Identify key functions]
4. [Note potential edge cases]

I'll start with the happy path, then add error handling."
```

#### 2B: Implementation (10-25 min)

**Speak While Coding:**
```
✓ "I'm using useCallback here to prevent re-renders"
✓ "This could be memoized, but I'll revisit if needed"
✓ "Adding this type ensures we catch errors early"
✓ "I'm handling the loading state to prevent race conditions"
```

**Code Quality Checklist (Per Feature):**
- [ ] Types defined first
- [ ] State variables declared
- [ ] Event handlers with useCallback
- [ ] useEffect with proper dependencies
- [ ] Error handling (try/catch)
- [ ] Loading states
- [ ] Cleanup functions

#### 2C: Testing Logic (5-8 min)
```
"Let me verify this works:

1. [Test normal flow]
2. [Test edge case: empty data]
3. [Test error scenario]
4. [Test loading state]

If I had more time, I'd add:
- Unit tests for pure functions
- Integration tests for hooks
- E2E for critical paths"
```

---

### Phase 3: Hardening & Optimization (40-50 min) ⚡️

**High-Impact Improvements (Pick 2-3):**

#### A. Error States
```typescript
// Add retry logic
const handleRetry = useCallback(async () => {
  setRetrying(true);
  try {
    await refetch();
  } finally {
    setRetrying(false);
  }
}, [refetch]);

// Show user-friendly errors
{error && (
  <View style={styles.error}>
    <Text>{error.message}</Text>
    <Button title="Retry" onPress={handleRetry} />
  </View>
)}
```

#### B. Performance
```typescript
// Memoize expensive computations
const sortedData = useMemo(
  () => data.sort((a, b) => b.likes - a.likes),
  [data]
);

// Prevent re-renders
const Row = React.memo(({ item }) => { ... });
```

#### C. UX Polish
```typescript
// Loading skeleton
{isLoading && <Skeleton count={5} />}

// Empty state
{!isLoading && data.length === 0 && <EmptyState />}

// Pull-to-refresh
<FlatList
  refreshControl={
    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
  }
/>
```

---

### Phase 4: Walkthrough & Trade-offs (50-60 min) 💬

**Template:**
```
"Let me walk through what I've built:

ARCHITECTURE:
- Separated concerns: UI, logic, data fetching
- Custom hooks for reusability
- Type-safe throughout

PERFORMANCE:
- Memoized components prevent unnecessary renders
- useCallback on event handlers
- FlatList optimizations for large lists

TRADE-OFFS:
1. Page size (20 items):
   - Smaller = more requests, smoother
   - Larger = fewer requests, potential jank
   - Chose 20 as balanced middle ground

2. Cache TTL (60 seconds):
   - Shorter = fresher data, more API calls
   - Longer = better performance, stale data risk
   - Chose 60s for reasonable freshness

WHAT I'D ADD WITH MORE TIME:
- Error boundary for graceful failures
- Retry with exponential backoff
- Optimistic updates for better UX
- Analytics tracking
- A/B testing infrastructure

SCALING CONSIDERATIONS:
- If list > 1000 items: virtual scrolling
- If API slows: queue requests, show cached
- If offline common: full offline-first architecture"
```

---

## 🎯 Common React Native Prompts

### 1. Paginated FlatList (80% Probability) 🔥🔥🔥

**Prompt:**
> "Build a scrollable feed that loads posts from an API. Support infinite scroll and pull-to-refresh."

**30-Min Implementation Checklist:**
- [ ] 0-5 min: Types (Post, PaginatedResponse)
- [ ] 5-10 min: usePagination hook
- [ ] 10-20 min: FlatList with memoized Row
- [ ] 20-25 min: Pull-to-refresh
- [ ] 25-30 min: Error/empty states

**Key Code Snippets:**
```typescript
// 1. Type Definition (2 min)
interface Post {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  hasMore: boolean;
}

// 2. Hook (8 min)
function usePagination<T>(fetchFn: (page: number) => Promise<PaginatedResponse<T>>) {
  const [data, setData] = useState<T[]>([]);
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
  }, [loading, hasMore, page, fetchFn]);

  useEffect(() => { loadMore(); }, []); // Initial load

  return { data, loading, hasMore, loadMore };
}

// 3. Component (15 min)
const Row = React.memo(({ item }: { item: Post }) => (
  <View style={styles.row}>
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.body}>{item.body}</Text>
  </View>
));

function PostList() {
  const { data, loading, hasMore, loadMore } = usePagination(fetchPosts);

  const keyExtractor = useCallback((item: Post) => item.id, []);
  const renderItem = useCallback(({ item }: { item: Post }) => <Row item={item} />, []);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
    />
  );
}
```

---

### 2. Controlled Form (40% Probability) 🔥

**Prompt:**
> "Create a login form with email/password validation."

**20-Min Implementation:**
```typescript
// 1. Types + Validation (5 min)
interface FormData {
  email: string;
  password: string;
}

const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email';
  return undefined;
};

// 2. Component (15 min)
function LoginForm() {
  const [form, setForm] = useState<FormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof FormData) => (value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    const emailError = validateEmail(form.email);
    if (emailError) newErrors.email = emailError;
    
    if (!form.password) newErrors.password = 'Password required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      // Success
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View>
      <TextInput
        value={form.email}
        onChangeText={handleChange('email')}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}
      
      {/* Password field similar */}
      
      <Button title="Submit" onPress={handleSubmit} disabled={submitting} />
    </View>
  );
}
```

---

### 3. Search with Debounce (30% Probability)

**Prompt:**
> "Add search functionality that queries API after user stops typing."

**15-Min Implementation:**
```typescript
function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery) {
        setResults([]);
        return;
      }
      
      setSearching(true);
      try {
        const data = await searchAPI(searchQuery);
        setResults(data);
      } finally {
        setSearching(false);
      }
    }, 300),
    []
  );

  const handleSearch = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  return (
    <View>
      <TextInput
        value={query}
        onChangeText={handleSearch}
        placeholder="Search..."
      />
      {searching && <ActivityIndicator />}
      <FlatList data={results} ... />
    </View>
  );
}
```

---

## 🧮 JavaScript Challenges

### 1. Debounce (Must-Know) ⏱️

**Prompt:** "Implement debounce function"

**Time:** 5-7 minutes

**Solution:**
```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Usage
const debouncedSearch = debounce((query: string) => {
  console.log('Searching:', query);
}, 300);

debouncedSearch('a'); // Won't execute
debouncedSearch('ab'); // Won't execute
debouncedSearch('abc'); // Executes after 300ms
```

**Discussion Points:**
- Time Complexity: O(1)
- Space Complexity: O(1)
- Use cases: Search input, form validation, window resize
- Why preserve `this` context?
- Difference from throttle?

---

### 2. Promise Pool (Senior-Level) 🏊‍♂️

**Prompt:** "Limit concurrent promise execution"

**Time:** 10-12 minutes

**Solution:**
```typescript
async function promisePool<T>(
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
      // Remove completed promise
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

// Usage
const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
const results = await promisePool(
  urls.map(url => () => fetch(url)),
  2 // Only 2 concurrent requests
);
```

**Discussion Points:**
- Why not `Promise.all`? (No concurrency control)
- Time: Sequential = 5s, Pool(2) = 3s, All = 1s
- Use cases: API rate limits, resource constraints
- Memory: O(concurrency) vs O(n)

---

### 3. Array Transform (Common) 📊

**Prompt:** "Group array by property"

**Time:** 5-7 minutes

**Solution:**
```typescript
function groupBy<T, K extends string | number>(
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

// Usage
const users = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
  { name: 'Bob', age: 25 },
];

const byAge = groupBy(users, u => u.age);
// { 25: [...], 30: [...] }
```

**Discussion Points:**
- Time: O(n)
- Space: O(n)
- Alternative: `Map<K, T[]>` for non-string keys
- Can be implemented with `for...of` loop

---

## 💬 Discussion Topics

### Performance Deep Dive

**Q: "How do you optimize a slow FlatList?"**

**A:** (Answer in order of impact)
```
1. MEMOIZATION:
   - React.memo on row component
   - useCallback on renderItem
   - useMemo for expensive computations

2. FLATLIST PROPS:
   - removeClippedSubviews={true}
   - maxToRenderPerBatch={10}
   - windowSize={10}
   - getItemLayout (if fixed height)

3. DATA:
   - Paginate (don't render 1000 items)
   - Virtual scrolling for massive lists
   - Cache images, lazy load heavy content

4. PROFILING:
   - Use React DevTools Profiler
   - Check JS thread blocking
   - Monitor memory usage

5. LAST RESORT:
   - FlatList → SectionList (if applicable)
   - Custom native list component
   - RecyclerListView library
```

---

**Q: "Explain React Native's threading model"**

**A:**
```
THREE THREADS:

1. JS THREAD:
   - Runs React code, business logic
   - Single-threaded (like web)
   - Can block → causes jank

2. UI THREAD (Main/Native):
   - Runs native rendering
   - Handles touch events
   - Should stay responsive

3. SHADOW THREAD:
   - Layout calculations (Yoga)
   - Runs in background
   - Communicates with UI thread

BRIDGE:
- Async message passing between JS ↔ Native
- Serializes data (JSON)
- Can be bottleneck for heavy traffic

SOLUTIONS FOR BLOCKING:
- Move heavy work to native modules
- Use InteractionManager.runAfterInteractions()
- Hermes for faster JS execution
- Background threads for CPU-intensive tasks
```

---

**Q: "How would you implement offline support?"**

**A:**
```
STRATEGY: Cache-First with Background Sync

1. CACHE LAYER (AsyncStorage):
   - Store API responses locally
   - Add timestamps for freshness
   - Implement TTL (time-to-live)

2. STALE-WHILE-REVALIDATE:
   - Return cached data immediately
   - Fetch fresh data in background
   - Update cache when response arrives
   - User sees instant results

3. OPTIMISTIC UPDATES:
   - Update UI before API response
   - Roll back on error
   - Queue mutations for offline

4. SYNC QUEUE:
   - Store pending actions offline
   - Retry with exponential backoff
   - Sync when connection returns

5. CONFLICT RESOLUTION:
   - Last-write-wins (simple)
   - Merge strategies (complex)
   - Let user decide (safest)

LIBRARIES:
- AsyncStorage (key-value)
- WatermelonDB (SQLite wrapper)
- Realm (mobile database)
- React Query (server state)
```

---

**Q: "When would you use Context vs Redux?"**

**A:**
```
CONTEXT:
✓ Small app, limited state
✓ Infrequent updates (theme, user)
✓ Don't need time-travel debugging
✓ Want simplicity

REDUX:
✓ Large app, complex state
✓ Frequent updates across components
✓ Need DevTools, time-travel
✓ Want middleware (logging, analytics)

EVOLUTION:
useState → Context → Redux Toolkit → RTK Query

MODERN APPROACH:
- Local state: useState/useReducer
- Server state: React Query / RTK Query
- Global state: Context or Zustand
- Only use Redux if team familiar or need features
```

---

## 🚨 Red Flags to Avoid

### Code Smells That Fail Interviews

#### 1. ❌ ANY Everywhere
```typescript
// BAD
const data: any = await fetch();
function handlePress(item: any) { ... }

// GOOD
interface Post { id: string; title: string; }
const data: Post[] = await fetch();
function handlePress(item: Post) { ... }
```

#### 2. ❌ No Error Handling
```typescript
// BAD
const data = await fetch();
setData(data);

// GOOD
try {
  const data = await fetch();
  setData(data);
} catch (error) {
  setError(error.message);
  showErrorToast();
}
```

#### 3. ❌ Missing Dependencies
```typescript
// BAD
useEffect(() => {
  fetchData(userId);
}, []); // userId missing!

// GOOD
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

#### 4. ❌ Inline Functions in Renders
```typescript
// BAD
<FlatList renderItem={({ item }) => <Row item={item} />} />

// GOOD
const renderItem = useCallback(({ item }) => <Row item={item} />, []);
<FlatList renderItem={renderItem} />
```

#### 5. ❌ No Loading States
```typescript
// BAD
return <FlatList data={data} />;

// GOOD
if (loading) return <LoadingSpinner />;
if (error) return <ErrorView error={error} />;
return <FlatList data={data} />;
```

---

## 📝 Post-Interview

### Self-Evaluation Checklist

**Immediately After (While Fresh):**
- [ ] What went well?
- [ ] What stumbled you?
- [ ] Questions you couldn't answer?
- [ ] Topics to review?

**Within 24 Hours:**
- [ ] Send thank-you email
- [ ] Mention specific discussion points
- [ ] Reiterate interest
- [ ] Add any follow-up thoughts

**For Next Time:**
- [ ] Practice weak areas
- [ ] Time yourself on implementations
- [ ] Record yourself explaining code
- [ ] Get peer code review

---

### Follow-Up Email Template

```
Subject: Thank you - [Position] Interview

Hi [Interviewer Name],

Thank you for the opportunity to interview for [Position] at [Company]. 
I enjoyed our discussion about [specific technical topic discussed].

After our conversation, I reflected on the [specific problem] we worked through. 
If I were to approach it again, I would [improvement or alternative approach]. 
This demonstrates how I continuously learn and refine solutions.

I'm very excited about the possibility of joining [Team] and contributing to 
[specific project or goal mentioned]. Please let me know if you need any 
additional information from me.

Looking forward to hearing from you.

Best regards,
[Your Name]
```

---

## 🎯 Final Checklist - Day Before Interview

### Technical Prep
- [ ] Run through 2-3 implementations cold
- [ ] Review CHEAT_SHEET.md one final time
- [ ] Practice explaining complexity
- [ ] Prepare 2-3 questions for interviewer

### Logistics
- [ ] Test internet connection
- [ ] IDE/editor set up and working
- [ ] Quiet environment confirmed
- [ ] Phone silenced
- [ ] Water nearby

### Mental Prep
- [ ] Good night's sleep (7-8 hours)
- [ ] Light meal before (not too heavy)
- [ ] 15-min walk/exercise to calm nerves
- [ ] Arrive/log in 5 minutes early

### Remember
✅ You've prepared extensively  
✅ Interviewers want you to succeed  
✅ Communication matters as much as code  
✅ Perfect code isn't expected  
✅ Learning mindset impresses  

**Trust your preparation. You've got this! 🚀**

---

**Good luck with your interview!**
