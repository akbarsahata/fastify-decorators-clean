import { Service } from 'fastify-decorators';
import { secondsToDurationText } from '../../../lib/utils/helpers';
import { HealthResponseItem } from '../../../application/dtos/health.dto';
import { HealthService } from '../../../application/services/health.service';

@Service()
export class CommonHealthService implements HealthService {
  getUptimeAndDate(): HealthResponseItem {
    const uptime = secondsToDurationText(process.uptime());

    return {
      uptime,
      date: new Date().toISOString(),
      status: 'ok',
    };
  }
}
export { HealthService };
