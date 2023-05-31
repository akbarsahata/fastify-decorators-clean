import { HealthResponseItem } from '../dtos/health.dto';

export interface HealthService {
  getUptimeAndDate(): HealthResponseItem;
}
