import { Controller, GET, Inject } from 'fastify-decorators';
import { ProductUseCase } from '../../../application/usecases/product.usecase';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  GetManyProductResponse,
  getManyProductResponseDTO,
} from '../../../application/dtos/product.dto';

@Controller({
  route: '/products',
  tags: [{ name: 'product' }],
})
export default class ProductController {
  @Inject(ProductUseCase)
  private useCase: ProductUseCase;

  @GET({
    url: '',
    options: {
      schema: {
        response: {
          200: getManyProductResponseDTO,
        },
      },
    },
  })
  async getManyProducts(_req: FastifyRequest, res: FastifyReply): Promise<GetManyProductResponse> {
    const response = await this.useCase.getManyProducts();

    res.status(response.code);

    return response;
  }
}
