import { Inject, Service } from 'fastify-decorators';
import { HealthResponseItem } from '../dtos/health.dto';
import { HealthService } from '../services/health.service';
import { CommonHealthService } from '../../infrastructure/system/health';

@Service()
export class HealthUseCase {
  @Inject(CommonHealthService)
  private healthService: HealthService;

  getHealthInfo(): HealthResponseItem {
    const uptimeAndDate = this.healthService.getUptimeAndDate();

    return uptimeAndDate;
  }
}
