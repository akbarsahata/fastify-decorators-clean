import { Destructor, Initializer, Service } from 'fastify-decorators';
import { DataSource } from 'typeorm';

import { minutesToMilliseconds } from 'date-fns';
import { env, psqlEnv, redisEnv } from '../../../lib/config/env';
import { UserPgsql } from '../entities/user-pqsql.entity';

@Service()
export class PgsqlConnection {
  connection!: DataSource;

  @Initializer()
  async init() {
    try {
      this.connection = new DataSource({
        type: 'postgres',
        database: psqlEnv.PGSQL_DB,
        host: psqlEnv.PGSQL_HOST,
        port: psqlEnv.PGSQL_PORT,
        schema: psqlEnv.PGSQL_SCHEMA,
        username: psqlEnv.PGSQL_USERNAME,
        password: psqlEnv.PGSQL_PASSWORD,
        maxQueryExecutionTime: minutesToMilliseconds(10),
        synchronize: false,
        extra: {
          max: 10,
        },
        entities: [UserPgsql],
        logging: env.DEBUG_MODE,
        cache: {
          type: 'ioredis',
          options: {
            host: redisEnv.REDIS_HOST,
            port: redisEnv.REDIS_PORT,
          },
        },
      });

      await this.connection.initialize();

      console.log({ message: '[CONNECTION] Connected to PostgreSQL' });
    } catch (error) {
      console.log({ message: '[CONNECTION] Error connecting to PostgreSQL' });
      console.error(error);
    }
  }

  @Destructor()
  async destroy() {
    await this.connection.destroy();
  }
}
