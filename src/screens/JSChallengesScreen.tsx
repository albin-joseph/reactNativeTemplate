/**
 * JavaScript Challenges Screen
 * 
 * Interactive demonstrations of common interview questions:
 * - Array transformations
 * - Debounce/Throttle
 * - Promise concurrency
 * - Deep cloning
 * - GroupBy
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {
  debounce,
  throttle,
  promisePool,
  groupBy,
  flatten,
  deepClone,
} from '../utils/jsUtils';

export const JSChallengesScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [throttledValue, setThrottledValue] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);

  // ============================================
  // 1. DEBOUNCE DEMO
  // ============================================

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setDebouncedValue(query);
    }, 500),
    []
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  // ============================================
  // 2. THROTTLE DEMO
  // ============================================

  const throttledClick = useCallback(
    throttle(() => {
      setThrottledCount(prev => prev + 1);
    }, 1000),
    []
  );

  const handleClick = () => {
    setClickCount(prev => prev + 1);
    throttledClick();
  };

  // ============================================
  // 3. PROMISE POOL DEMO
  // ============================================

  const handlePromisePool = async () => {
    const urls = Array.from({ length: 10 }, (_, i) => i + 1);

    const startTime = Date.now();

    // Simulate API calls with controlled concurrency
    const results = await promisePool(
      urls.map(id => () =>
        new Promise<string>(resolve => {
          setTimeout(() => resolve(`Result ${id}`), 1000);
        })
      ),
      3 // Only 3 concurrent requests
    );

    const duration = Date.now() - startTime;

    Alert.alert(
      'Promise Pool Result',
      `Fetched ${results.length} items\nTime: ${duration}ms\n\nWith 3 concurrent requests, 10 items took ~4 seconds\n(instead of 10 seconds sequential)`,
      [{ text: 'OK' }]
    );
  };

  // ============================================
  // 4. ARRAY TRANSFORM DEMO
  // ============================================

  const handleArrayTransform = () => {
    const users = [
      { id: 1, name: 'John', age: 25, city: 'New York' },
      { id: 2, name: 'Jane', age: 30, city: 'London' },
      { id: 3, name: 'Bob', age: 25, city: 'New York' },
      { id: 4, name: 'Alice', age: 30, city: 'Paris' },
    ];

    // Group by age
    const byAge = groupBy(users, u => u.age);

    // Group by city
    const byCity = groupBy(users, u => u.city);

    Alert.alert(
      'Array Transform',
      `Original: ${users.length} users\n\nGrouped by age:\n${JSON.stringify(Object.keys(byAge), null, 2)}\n\nGrouped by city:\n${JSON.stringify(Object.keys(byCity), null, 2)}`,
      [{ text: 'OK' }]
    );
  };

  // ============================================
  // 5. FLATTEN DEMO
  // ============================================

  const handleFlatten = () => {
    const nested = [1, [2, [3, [4, 5]], 6], 7, [8, 9]];

    const flat1 = flatten(nested, 1);
    const flat2 = flatten(nested, 2);
    const flatAll = flatten(nested);

    Alert.alert(
      'Flatten Array',
      `Original: ${JSON.stringify(nested)}\n\nDepth 1: ${JSON.stringify(flat1)}\n\nDepth 2: ${JSON.stringify(flat2)}\n\nFully flat: ${JSON.stringify(flatAll)}`,
      [{ text: 'OK' }]
    );
  };

  // ============================================
  // 6. DEEP CLONE DEMO
  // ============================================

  const handleDeepClone = () => {
    const original = {
      name: 'John',
      address: {
        city: 'New York',
        coords: { lat: 40.7128, lng: -74.006 },
      },
      hobbies: ['reading', 'coding'],
    };

    const cloned = deepClone(original);
    cloned.address.city = 'London';
    cloned.hobbies.push('swimming');

    Alert.alert(
      'Deep Clone',
      `Original city: ${original.address.city}\nCloned city: ${cloned.address.city}\n\nOriginal hobbies: ${original.hobbies.length}\nCloned hobbies: ${cloned.hobbies.length}\n\nMutation isolated!`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Debounce Demo</Text>
        <Text style={styles.description}>
          Type in the input. Debounced value updates only after 500ms of
          inactivity.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Type here..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />

        <View style={styles.result}>
          <Text style={styles.resultLabel}>Current: {searchQuery}</Text>
          <Text style={styles.resultValue}>Debounced: {debouncedValue}</Text>
        </View>

        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>Use Cases:</Text>
          <Text style={styles.explanationText}>• Search inputs</Text>
          <Text style={styles.explanationText}>• Form validation</Text>
          <Text style={styles.explanationText}>• Window resize</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Throttle Demo</Text>
        <Text style={styles.description}>
          Click rapidly. Throttled function executes max once per second.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleClick}>
          <Text style={styles.buttonText}>Click Me Rapidly!</Text>
        </TouchableOpacity>

        <View style={styles.result}>
          <Text style={styles.resultLabel}>Total clicks: {clickCount}</Text>
          <Text style={styles.resultValue}>
            Throttled executions: {throttledCount}
          </Text>
        </View>

        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>Use Cases:</Text>
          <Text style={styles.explanationText}>• Scroll events</Text>
          <Text style={styles.explanationText}>• API rate limiting</Text>
          <Text style={styles.explanationText}>• Button spam prevention</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Promise Pool</Text>
        <Text style={styles.description}>
          Controls concurrency for async operations. Runs 10 promises with max
          3 concurrent.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handlePromisePool}>
          <Text style={styles.buttonText}>Run Promise Pool</Text>
        </TouchableOpacity>

        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>Use Cases:</Text>
          <Text style={styles.explanationText}>• Batch API calls</Text>
          <Text style={styles.explanationText}>• Image processing</Text>
          <Text style={styles.explanationText}>• File uploads</Text>
          <Text style={styles.explanationText}>
            Time: ~4s vs 10s sequential
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Array Transforms</Text>
        <Text style={styles.description}>
          GroupBy implementation - O(n) time complexity.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleArrayTransform}>
          <Text style={styles.buttonText}>Run GroupBy</Text>
        </TouchableOpacity>

        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>Use Cases:</Text>
          <Text style={styles.explanationText}>• Data aggregation</Text>
          <Text style={styles.explanationText}>• Category grouping</Text>
          <Text style={styles.explanationText}>• Statistical analysis</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Flatten Array</Text>
        <Text style={styles.description}>
          Flattens nested arrays to specified depth.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleFlatten}>
          <Text style={styles.buttonText}>Run Flatten</Text>
        </TouchableOpacity>

        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>Complexity:</Text>
          <Text style={styles.explanationText}>• Time: O(n)</Text>
          <Text style={styles.explanationText}>• Space: O(d) recursion</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Deep Clone</Text>
        <Text style={styles.description}>
          Creates deep copy of objects, prevents reference sharing.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleDeepClone}>
          <Text style={styles.buttonText}>Run Deep Clone</Text>
        </TouchableOpacity>

        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>Use Cases:</Text>
          <Text style={styles.explanationText}>• State immutability</Text>
          <Text style={styles.explanationText}>• Undo/Redo systems</Text>
          <Text style={styles.explanationText}>• Form snapshots</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  result: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  explanation: {
    backgroundColor: '#E8F4FF',
    padding: 12,
    borderRadius: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  divider: {
    height: 8,
    backgroundColor: '#F5F5F5',
  },
});
