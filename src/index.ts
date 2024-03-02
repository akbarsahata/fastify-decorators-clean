/* eslint-disable no-console */
import 'reflect-metadata';

import figlet from 'figlet';

import closeWithGrace from 'close-with-grace';
import { getInstanceByToken } from 'fastify-decorators';
import pkg from '../package.json';
import { initServer } from './infrastructure/http';
import { env } from './lib/config/env';
import { sleep } from './lib/utils/helpers';
import { Logger } from './lib/utils/logger';

const logger = getInstanceByToken<Logger>(Logger);

const start = async () => {
  try {
    const server = await initServer();

    await server.listen({
      port: env.APP_PORT,
      host: env.APP_HOST,
    });

    // Sleep for 3 seconds to allow all dependencies to start
    if (!env.isTest && !env.isDev) await sleep(3000);

    await server.ready();

    server.swagger();

    closeWithGrace(async () => {
      logger.info('server is closing');
      await server.close();
      logger.info('server is closed');

      process.exit(0);
    });
  } catch (error) {
    logger.error(error);

    throw error;
  }
};

start()
  .then(() => {
    if (env.isDev) {
      figlet(env.APP_NAME, (err, text) => {
        if (err) {
          throw err;
        }

        logger.info(text);
        logger.info(`v${pkg.version}`);
        logger.info(`Server is running at http://${env.APP_URL}:${env.APP_PORT}`);
        logger.info(`Swagger can be viewed at http://${env.APP_URL}:${env.APP_PORT}/docs`);
      });
    }

    process.send?.('ready');
  })
  .catch(() => {
    process.exit(1);
  });
