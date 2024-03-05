import { Destructor, Initializer, Inject, Service } from 'fastify-decorators';
import { DataSource } from 'typeorm';

import { minutesToMilliseconds } from 'date-fns';
import { env, psqlEnv, redisEnv } from '../../../lib/config/env';
import { UserPgsql } from '../entities/user-pqsql.entity';
import { ProductPgsql } from '../entities/product-pgsql.entity';
import { FarmerPgsql } from '../entities/farming-pqsql.entity';
import { DBLogger, Logger } from '../../../lib/utils/logger';

@Service()
export class PgsqlConnection {
  connection!: DataSource;

  @Inject(Logger)
  private logger!: Logger;

  @Inject(DBLogger)
  private dbLogger!: DBLogger;

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
        entities: [UserPgsql, ProductPgsql, FarmerPgsql],
        logging: env.DEBUG_MODE && psqlEnv.PGSQL_LOG,
        logger: env.DEBUG_MODE && psqlEnv.PGSQL_LOG ? this.dbLogger : undefined,
        cache: {
          type: 'ioredis',
          options: {
            host: redisEnv.REDIS_HOST,
            port: redisEnv.REDIS_PORT,
          },
        },
      });

      await this.connection.initialize();

      this.logger.info({ message: '[CONNECTION] Connected to PostgreSQL' });
    } catch (error) {
      this.logger.info({ message: '[CONNECTION] Error connecting to PostgreSQL' });

      this.logger.error(error);
    }
  }

  @Destructor()
  async destroy() {
    await this.connection.destroy();
  }
}
