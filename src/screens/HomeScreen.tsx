/**
 * Home Screen
 * 
 * Navigation hub for all interview preparation demos
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

interface DemoCard {
  title: string;
  description: string;
  route: keyof RootStackParamList;
  color: string;
  topics: string[];
}

const DEMOS: DemoCard[] = [
  {
    title: '📋 Paginated List',
    description: 'Infinite scroll with pull-to-refresh',
    route: 'PaginatedList',
    color: '#007AFF',
    topics: [
      'FlatList optimization',
      'Pagination logic',
      'Loading states',
      'Pull-to-refresh',
    ],
  },
  {
    title: '💾 Cached Data',
    description: 'Stale-while-revalidate pattern',
    route: 'CachedData',
    color: '#34C759',
    topics: [
      'AsyncStorage',
      'Cache strategies',
      'Offline support',
      'Background revalidation',
    ],
  },
  {
    title: '🔐 Login Form',
    description: 'Controlled inputs with validation',
    route: 'LoginForm',
    color: '#FF9500',
    topics: [
      'Form validation',
      'Error handling',
      'Accessibility',
      'Keyboard handling',
    ],
  },
  {
    title: '⚡️ JS Challenges',
    description: 'Common interview algorithms',
    route: 'JSChallenges',
    color: '#FF2D55',
    topics: [
      'Debounce/Throttle',
      'Promise pool',
      'Array transforms',
      'Deep clone',
    ],
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>React Native</Text>
        <Text style={styles.subtitle}>Interview Preparation</Text>
        <Text style={styles.description}>
          Comprehensive demonstrations of essential patterns, optimizations, and
          best practices for senior-level RN interviews.
        </Text>
      </View>

      <View style={styles.grid}>
        {DEMOS.map((demo, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { borderLeftColor: demo.color }]}
            onPress={() => navigation.navigate(demo.route)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardTitle}>{demo.title}</Text>
            <Text style={styles.cardDescription}>{demo.description}</Text>

            <View style={styles.topicsContainer}>
              {demo.topics.map((topic, idx) => (
                <View key={idx} style={styles.topicBadge}>
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>📚 What This Covers</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <Text style={styles.sectionText}>
            • FlatList optimization with React.memo{'\n'}
            • Proper useCallback/useMemo usage{'\n'}
            • Avoiding inline functions{'\n'}
            • Memory management
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>State Management</Text>
          <Text style={styles.sectionText}>
            • useState vs useReducer{'\n'}
            • Custom hooks for reusability{'\n'}
            • Async state handling{'\n'}
            • Loading/Error states
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>JavaScript Fundamentals</Text>
          <Text style={styles.sectionText}>
            • Closures (debounce, throttle){'\n'}
            • Promise concurrency control{'\n'}
            • Array transformations{'\n'}
            • Time/Space complexity
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Architecture</Text>
          <Text style={styles.sectionText}>
            • Separation of concerns{'\n'}
            • Service layer pattern{'\n'}
            • Type safety with TypeScript{'\n'}
            • Testable code structure
          </Text>
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
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  grid: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topicText: {
    fontSize: 12,
    color: '#666666',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    marginTop: 8,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
  },
});
