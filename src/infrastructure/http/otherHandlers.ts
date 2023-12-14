import { requestContext } from '@fastify/request-context';
import { FastifyInstance } from 'fastify';
import { getInstanceByToken } from 'fastify-decorators';
import pkg from '../../../package.json';
import { env } from '../../lib/config/env';
import { secondsToDurationText } from '../../lib/utils/helpers';
import { Logger } from '../../lib/utils/logger';

const logger = getInstanceByToken<Logger>(Logger);

export const registerOtherHandlers = async (server: FastifyInstance) => {
  server.setErrorHandler((error, request, reply) => {
    if (env.DEBUG_MODE) {
      const requestId =
        requestContext.get('requestId') || (request.headers['x-request-id'] as string) || '';

      Reflect.set(error, 'request_id', requestId);

      logger.error(error);
    }

    let code = error.statusCode || 500;

    if (error.validation) {
      code = 400;
    }

    reply.status(code);
    reply.send({
      error: error.code,
      error_description: error.message,
      ...(error.stack && env.isDev && { stack: error.stack }),
    });
  });

  server.setNotFoundHandler((request, reply) => {
    reply.status(404);
    reply.send({
      code: 404,
      error: {
        message: `Route ${request.method}:${request.url} not found`,
      },
    });
  });

  server.get('/', (_, reply) => {
    reply.status(200);
    reply.header('content-type', 'text/html');
    reply.header('content-security-policy', "script-src 'self' 'nonce-694206664444' https:;");
    reply.sendFile('index.html');
  });

  server.all('/status', async (_, reply) => {
    const uptime = secondsToDurationText(process.uptime());

    reply.header('content-type', 'application/json');
    reply.status(200);

    reply.send({
      code: 200,
      data: {
        name: pkg.name,
        version: `v${pkg.version}`,
        pid: process.pid,
        uptime,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      },
    });
  });
};
