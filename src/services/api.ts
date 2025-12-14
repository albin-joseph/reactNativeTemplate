/**
 * Mock API Service for Interview Demonstrations
 * Simulates real-world API behavior with delays, pagination, errors
 */

import { Post, User, PaginatedResponse, ApiError } from '../types';
import { retry } from '../utils/jsUtils';

// ============================================
// Mock Data Generation
// ============================================

const generateUser = (id: number): User => ({
  id: `user-${id}`,
  name: `User ${id}`,
  email: `user${id}@example.com`,
  avatar: `https://i.pravatar.cc/150?img=${id}`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
});

const generatePost = (id: number): Post => ({
  id: `post-${id}`,
  userId: `user-${Math.floor(Math.random() * 10) + 1}`,
  title: `Post Title ${id}`,
  body: `This is the body content for post ${id}. It contains meaningful text that demonstrates data handling.`,
  imageUrl: Math.random() > 0.5 ? `https://picsum.photos/400/300?random=${id}` : undefined,
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 100),
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
});

// Generate mock data
const USERS = Array.from({ length: 50 }, (_, i) => generateUser(i + 1));
const POSTS = Array.from({ length: 500 }, (_, i) => generatePost(i + 1));

// ============================================
// Utility Functions
// ============================================

/**
 * Simulates network delay
 * Interviewers look for this in mock implementations
 */
const delay = (ms: number = 1000): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simulates random network failures
 * Tests error handling implementation
 */
const shouldSimulateError = (errorRate: number = 0.1): boolean =>
  Math.random() < errorRate;

const createError = (message: string, status: number = 500): ApiError => ({
  message,
  code: 'API_ERROR',
  status,
});

// ============================================
// API Service
// ============================================

class ApiService {
  /**
   * Fetch paginated posts
   * Demonstrates: Pagination logic, delay simulation, error handling
   * 
   * Time Complexity: O(n) where n is pageSize
   * 
   * @param page - Page number (1-indexed)
   * @param pageSize - Items per page
   */
  async fetchPosts(
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Post>> {
    // Simulate network delay (realistic interview scenario)
    await delay(800 + Math.random() * 400);

    // Simulate occasional errors
    if (shouldSimulateError(0.05)) {
      throw createError('Failed to fetch posts', 500);
    }

    // Calculate pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = POSTS.slice(startIndex, endIndex);

    return {
      data,
      page,
      pageSize,
      total: POSTS.length,
      hasMore: endIndex < POSTS.length,
    };
  }

  /**
   * Fetch single post by ID
   * Demonstrates: Single item fetch, error cases
   */
  async fetchPostById(id: string): Promise<Post> {
    await delay(500);

    const post = POSTS.find(p => p.id === id);

    if (!post) {
      throw createError(`Post ${id} not found`, 404);
    }

    return post;
  }

  /**
   * Fetch user data
   * Demonstrates: User authentication simulation
   */
  async fetchUser(userId: string): Promise<User> {
    await delay(600);

    const user = USERS.find(u => u.id === userId);

    if (!user) {
      throw createError(`User ${userId} not found`, 404);
    }

    return user;
  }

  /**
   * Login simulation
   * Demonstrates: Form submission, validation, async state
   */
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    await delay(1200);

    // Simulate validation
    if (!email || !email.includes('@')) {
      throw createError('Invalid email format', 400);
    }

    if (password.length < 6) {
      throw createError('Password must be at least 6 characters', 400);
    }

    // Simulate authentication
    if (password !== 'password123') {
      throw createError('Invalid credentials', 401);
    }

    const user = USERS[0];

    return {
      token: 'mock-jwt-token-' + Date.now(),
      user,
    };
  }

  /**
   * Search posts
   * Demonstrates: Filtering, debounced search implementation
   */
  async searchPosts(query: string): Promise<Post[]> {
    await delay(600);

    if (!query) {
      return [];
    }

    return POSTS.filter(
      post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 20);
  }

  /**
   * Fetch with retry
   * Demonstrates: Error recovery, exponential backoff
   */
  async fetchWithRetry<T>(
    fetchFn: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    return retry(fetchFn, {
      maxRetries,
      baseDelay: 1000,
    });
  }
}

// ============================================
// Export Singleton Instance
// ============================================

export const api = new ApiService();

// Export for testing
export { USERS, POSTS };
