import { Destructor, Initializer, Service } from 'fastify-decorators';
import { DataSource } from 'typeorm';

import { minutesToMilliseconds } from 'date-fns';
import { env, psqlEnv } from '../../../lib/config/env';
import { ProductPgsql } from '../entities/pgsql/product-pgsql.entity';

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
        entities: [ProductPgsql],
        logging: env.DEBUG_MODE,
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
