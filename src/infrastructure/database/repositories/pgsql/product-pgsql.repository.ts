import { Initializer, Inject, Service } from 'fastify-decorators';
import { Product } from '../../../../domain/entities/product.entity';
import { GetAllParams, GetOneParams } from '../../../../domain/repositories/base.repository';
import { ProductRepository } from '../../../../domain/repositories/product.repository';
import { PgsqlConnection } from '../../connections/pgsql.connection';
import { ProductPgsql } from '../../entities/pgsql/product-pgsql.entity';
import { Repository } from 'typeorm';

@Service()
export class ProductPgsqlRepository implements ProductRepository {
  @Inject(PgsqlConnection)
  private pgsql!: PgsqlConnection;

  protected repository: Repository<ProductPgsql>;

  @Initializer([PgsqlConnection])
  init() {
    this.repository = this.pgsql.connection.getRepository(ProductPgsql);
  }

  async getAll(params: GetAllParams<Product>): Promise<Product[]> {
    const products = await this.repository.find(params);

    return products;
  }

  async getOne(params: GetOneParams<Product>): Promise<Product> {
    const product = {
      id: '1',
      code: 'name',
      name: 'code',
      lastModified: new Date(),
    };

    if (params) return product;

    return product;
  }
}
