import { Controller, GET, Inject } from 'fastify-decorators';
import { HealthUseCase } from '../../../application/usecases/health.usecase';
import { HealthResponse, healthResponseDTO } from '../../../application/dtos/health.dto';

@Controller({
  route: '/health',
  tags: [{ name: 'health' }],
})
export default class HealthController {
  @Inject(HealthUseCase)
  private useCase: HealthUseCase;

  @GET({
    url: '/',
    options: {
      schema: {
        response: { 200: healthResponseDTO },
      },
    },
  })
  async getHealthInfo(): Promise<HealthResponse> {
    const healthInfo = this.useCase.getHealthInfo();

    return {
      code: 200,
      data: healthInfo,
    };
  }
}
