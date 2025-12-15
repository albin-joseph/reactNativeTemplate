/**
 * Data Layer - Product DTO (Data Transfer Object)
 * API response models
 */

export interface RatingDTO {
  rate: number;
  count: number;
}

export interface ProductDTO {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: RatingDTO;
}
