import { Initializer, Inject, Service } from 'fastify-decorators';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from '../../../../domain/entities/user.entity';
import { GetAllParams, GetOneParams } from '../../../../domain/repositories/base.repository';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { replaceWithIsNull } from '../../../../lib/utils/helpers';
import { PgsqlConnection } from '../../connections/pgsql.connection';
import { UserPgsql } from '../../entities/pgsql/user-pqsql.entity';

@Service()
export class UserPgsqlRepository implements UserRepository {
  @Inject(PgsqlConnection)
  private pgsql!: PgsqlConnection;

  protected repository: Repository<UserPgsql>;

  @Initializer([PgsqlConnection])
  async init() {
    this.repository = this.pgsql.connection.getRepository(UserPgsql);
  }

  async getAll(params: GetAllParams<User>): Promise<User[]> {
    const users = await this.repository.find({
      ...(params.where && {
        where: replaceWithIsNull(params.where) as FindManyOptions<UserPgsql>['where'],
      }),
      ...(params.select && { select: params.select as FindManyOptions<UserPgsql>['select'] }),
      ...(params.take && { take: params.take }),
      ...(params.skip && { skip: params.skip }),
      ...(params.order && { order: params.order as FindManyOptions<UserPgsql>['order'] }),
    });

    return users;
  }

  async getOne(params: GetOneParams<User>): Promise<User | null> {
    const user = await this.repository.findOne({
      ...(params.where && {
        where: replaceWithIsNull(params.where) as FindOneOptions<UserPgsql>['where'],
      }),
      ...(params.select && { select: params.select as FindOneOptions<UserPgsql>['select'] }),
    });

    return user;
  }

  async updateOneById(id: string, data: Partial<User>): Promise<User> {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) throw new Error('User not found');

    const updatedUser = await this.repository.save({ ...user, ...data, modifiedAt: new Date() });

    return updatedUser;
  }
}
