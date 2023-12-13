import { Inject, Service } from 'fastify-decorators';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductPgsqlRepository } from '../../infrastructure/pgsql/repositories/product-pgsql.repository';
import { GetManyProductResponseItem } from '../dtos/product.dto';

@Service()
export class ProductService {
  @Inject(ProductPgsqlRepository) repository: ProductRepository;

  async getManyProducts(): Promise<GetManyProductResponseItem[]> {
    const products = await this.repository.getAll({});

    return products.map((p) => ({ ...p, lastModified: p.lastModified.toISOString() }));
  }
}
