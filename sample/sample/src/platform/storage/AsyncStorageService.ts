/**
 * Platform Layer - AsyncStorage Implementation
 * Concrete implementation of IStorageService using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { IStorageService } from './IStorageService';

export class AsyncStorageService implements IStorageService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`Storage get failed for key: ${key}`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Storage set failed for key: ${key}`, error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn(`Storage remove failed for key: ${key}`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.warn('Storage clear failed', error);
    }
  }
}
