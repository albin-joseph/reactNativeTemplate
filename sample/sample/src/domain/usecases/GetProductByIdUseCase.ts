/**
 * Domain Layer - Get Product By ID Use Case
 */

import { UseCase } from './UseCase';
import { IProductRepository } from '../repositories/IProductRepository';
import { Product } from '../entities/Product';

export class GetProductByIdUseCase extends UseCase<number, Product | null> {
  constructor(private productRepository: IProductRepository) {
    super();
  }

  async execute(productId: number): Promise<Product | null> {
    return this.productRepository.getProductById(productId);
  }
}
