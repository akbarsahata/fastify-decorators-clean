/* eslint-disable no-console */
import 'reflect-metadata';

import figlet from 'figlet';

import pkg from '../package.json';
import { initServer } from './infrastructure/http/server';
import { env } from './lib/config/env';

const start = async () => {
  try {
    const server = await initServer();

    await server.ready();

    await server.listen({
      port: env.APP_PORT,
      host: env.APP_HOST,
    });

    if (env.isDev) {
      figlet(env.APP_NAME, (err, text) => {
        if (err) {
          throw err;
        }

        console.log(text);
        console.log(`v${pkg.version}`);
        console.log(`Server is running at http://${env.APP_URL}:${env.APP_PORT}`);
        console.log(`Swagger can be viewed at http://${env.APP_URL}:${env.APP_PORT}/docs`);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

start();
