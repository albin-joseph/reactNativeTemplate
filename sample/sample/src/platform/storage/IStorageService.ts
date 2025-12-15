/**
 * Platform Layer - Storage Interface
 * Abstract interface for storage operations (Dependency Inversion Principle)
 */

export interface IStorageService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}
