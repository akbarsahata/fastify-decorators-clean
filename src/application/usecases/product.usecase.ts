import { Inject, Service } from 'fastify-decorators';
import { ProductService } from '../services/product.service';
import { GetManyProductResponse } from '../dtos/product.dto';

@Service()
export class ProductUseCase {
  @Inject(ProductService)
  private service: ProductService;

  async getManyProducts(): Promise<GetManyProductResponse> {
    const data = await this.service.getManyProducts();

    return {
      code: 200,
      data,
    };
  }
}
