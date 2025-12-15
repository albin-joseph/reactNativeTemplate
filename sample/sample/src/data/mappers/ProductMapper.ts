/**
 * Data Layer - Product Mapper
 * Maps between DTOs and Domain Entities
 */

import { Product } from '../../domain/entities/Product';
import { ProductDTO } from '../models/ProductDTO';

export class ProductMapper {
  static toDomain(dto: ProductDTO): Product {
    return {
      id: dto.id,
      title: dto.title,
      price: dto.price,
      description: dto.description,
      category: dto.category,
      image: dto.image,
      rating: {
        rate: dto.rating.rate,
        count: dto.rating.count,
      },
    };
  }

  static toDomainList(dtos: ProductDTO[]): Product[] {
    return dtos.map((dto) => this.toDomain(dto));
  }

  static toDTO(product: Product): ProductDTO {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image: product.image,
      rating: {
        rate: product.rating.rate,
        count: product.rating.count,
      },
    };
  }
}
