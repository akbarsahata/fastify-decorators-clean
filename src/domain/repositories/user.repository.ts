import { User } from '../entities/user.entity';
import { BaseRepository } from './base.repository';

export interface UserRepository extends BaseRepository<User> {
  updateOneById(id: string, data: Partial<User>): Promise<User>;
}
