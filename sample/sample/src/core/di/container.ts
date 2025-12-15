/**
 * Core - Dependency Injection Container
 * Centralizes dependency creation and injection for testability
 */

import { IApiClient } from '../../data/api/IApiClient';
import { AxiosApiClient } from '../../data/api/AxiosApiClient';
import { IStorageService } from '../../platform/storage/IStorageService';
import { AsyncStorageService } from '../../platform/storage/AsyncStorageService';
import { INetworkService } from '../../platform/network/INetworkService';
import { NetworkService } from '../../platform/network/NetworkService';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { ProductRepository } from '../../data/repositories/ProductRepositoryImpl';
import { ICartRepository } from '../../domain/repositories/ICartRepository';
import { CartRepository } from '../../data/repositories/CartRepositoryImpl';
import {
  GetProductsUseCase,
  GetProductByIdUseCase,
  AddToCartUseCase,
  RemoveFromCartUseCase,
  UpdateCartQuantityUseCase,
  ClearCartUseCase,
  GetCartItemsUseCase,
} from '../../domain/usecases';

/**
 * Dependency Injection Container
 * Singleton pattern for managing application dependencies
 */
class DependencyContainer {
  private static instance: DependencyContainer;

  // Platform Layer
  private _storageService?: IStorageService;
  private _networkService?: INetworkService;
  private _apiClient?: IApiClient;

  // Data Layer
  private _productRepository?: IProductRepository;
  private _cartRepository?: ICartRepository;

  // Domain Layer - Use Cases
  private _getProductsUseCase?: GetProductsUseCase;
  private _getProductByIdUseCase?: GetProductByIdUseCase;
  private _addToCartUseCase?: AddToCartUseCase;
  private _removeFromCartUseCase?: RemoveFromCartUseCase;
  private _updateCartQuantityUseCase?: UpdateCartQuantityUseCase;
  private _clearCartUseCase?: ClearCartUseCase;
  private _getCartItemsUseCase?: GetCartItemsUseCase;

  private constructor() {}

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  // Platform Layer Getters
  get storageService(): IStorageService {
    if (!this._storageService) {
      this._storageService = new AsyncStorageService();
    }
    return this._storageService;
  }

  get networkService(): INetworkService {
    if (!this._networkService) {
      this._networkService = new NetworkService();
    }
    return this._networkService;
  }

  get apiClient(): IApiClient {
    if (!this._apiClient) {
      this._apiClient = new AxiosApiClient();
    }
    return this._apiClient;
  }

  // Data Layer Getters
  get productRepository(): IProductRepository {
    if (!this._productRepository) {
      this._productRepository = new ProductRepository(
        this.apiClient,
        this.storageService
      );
    }
    return this._productRepository;
  }

  get cartRepository(): ICartRepository {
    if (!this._cartRepository) {
      this._cartRepository = new CartRepository(this.storageService);
    }
    return this._cartRepository;
  }

  // Use Case Getters
  get getProductsUseCase(): GetProductsUseCase {
    if (!this._getProductsUseCase) {
      this._getProductsUseCase = new GetProductsUseCase(this.productRepository);
    }
    return this._getProductsUseCase;
  }

  get getProductByIdUseCase(): GetProductByIdUseCase {
    if (!this._getProductByIdUseCase) {
      this._getProductByIdUseCase = new GetProductByIdUseCase(this.productRepository);
    }
    return this._getProductByIdUseCase;
  }

  get addToCartUseCase(): AddToCartUseCase {
    if (!this._addToCartUseCase) {
      this._addToCartUseCase = new AddToCartUseCase(this.cartRepository);
    }
    return this._addToCartUseCase;
  }

  get removeFromCartUseCase(): RemoveFromCartUseCase {
    if (!this._removeFromCartUseCase) {
      this._removeFromCartUseCase = new RemoveFromCartUseCase(this.cartRepository);
    }
    return this._removeFromCartUseCase;
  }

  get updateCartQuantityUseCase(): UpdateCartQuantityUseCase {
    if (!this._updateCartQuantityUseCase) {
      this._updateCartQuantityUseCase = new UpdateCartQuantityUseCase(this.cartRepository);
    }
    return this._updateCartQuantityUseCase;
  }

  get clearCartUseCase(): ClearCartUseCase {
    if (!this._clearCartUseCase) {
      this._clearCartUseCase = new ClearCartUseCase(this.cartRepository);
    }
    return this._clearCartUseCase;
  }

  get getCartItemsUseCase(): GetCartItemsUseCase {
    if (!this._getCartItemsUseCase) {
      this._getCartItemsUseCase = new GetCartItemsUseCase(this.cartRepository);
    }
    return this._getCartItemsUseCase;
  }

  // For testing - allow injecting mocks
  setStorageService(service: IStorageService): void {
    this._storageService = service;
  }

  setApiClient(client: IApiClient): void {
    this._apiClient = client;
  }

  setProductRepository(repository: IProductRepository): void {
    this._productRepository = repository;
  }

  setCartRepository(repository: ICartRepository): void {
    this._cartRepository = repository;
  }

  // Reset all dependencies (useful for testing)
  reset(): void {
    this._storageService = undefined;
    this._networkService = undefined;
    this._apiClient = undefined;
    this._productRepository = undefined;
    this._cartRepository = undefined;
    this._getProductsUseCase = undefined;
    this._getProductByIdUseCase = undefined;
    this._addToCartUseCase = undefined;
    this._removeFromCartUseCase = undefined;
    this._updateCartQuantityUseCase = undefined;
    this._clearCartUseCase = undefined;
    this._getCartItemsUseCase = undefined;
  }
}

// Export singleton instance
export const container = DependencyContainer.getInstance();
