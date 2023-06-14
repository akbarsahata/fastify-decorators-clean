import { Product } from '../entities/product.entity';
import { BaseRepository, GetAllParams, GetOneParams } from './base.repository';

export interface ProductRepository extends BaseRepository<Product> {
  getAll(params: GetAllParams<Product>): Promise<Product[]>;
  getOne(params: GetOneParams<Product>): Promise<Product>;
}
