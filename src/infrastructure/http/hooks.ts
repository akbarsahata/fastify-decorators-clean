import { requestContext } from '@fastify/request-context';
import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { getInstanceByToken } from 'fastify-decorators';
import { Logger } from '../../lib/utils/logger';
import { env } from '../../lib/config/env';

const logger = getInstanceByToken<Logger>(Logger);

export const registerHooks = async (server: FastifyInstance) => {
  server.addHook('onRequest', (request, _, done) => {
    const requestId =
      (request.headers['X-Request-Id'] as string) ||
      (request.headers['x-request-id'] as string) ||
      '';

    if (!requestId) {
      request.headers['x-request-id'] = randomUUID();
    }

    done();
  });

  server.addHook('preValidation', (request, _, done) => {
    const requestId = (request.headers['x-request-id'] as string) || '';
    const userId = (request.headers['x-id'] as string) || '';
    const userToken = (request.headers.authorization as string) || '';

    requestContext.set('requestId', requestId);
    requestContext.set('userId', userId);
    requestContext.set('userToken', userToken);
    requestContext.set('startTime', Date.now());

    logger.logRequest({
      log_level: 'info',
      ctx: 'request-log',
      request_id: requestId,
      method: request.method.toUpperCase(),
      url: request.routerPath,
      user_id: userId,
      user_token: userToken,
      headers: env.DEBUG_MODE ? request.headers : undefined,
      params: env.DEBUG_MODE && request.params ? request.params : undefined,
      querystring: env.DEBUG_MODE && request.query ? request.query : undefined,
      body: env.DEBUG_MODE && request.body ? request.body : undefined,
    });

    done();
  });

  server.addHook('onSend', (request, reply, payload, done) => {
    const requestId =
      requestContext.get('requestId') || (request.headers['x-request-id'] as string) || '';

    const startTime = requestContext.get('startTime') || 0;

    const responseTime = Date.now() - startTime;

    logger.logResponse({
      log_level: 'info',
      ctx: 'response-log',
      request_id: requestId,
      status_code: reply.statusCode,
      response_time: `${reply.getResponseTime() || responseTime} ms`,
      response: env.DEBUG_MODE ? logger.parsePayload(payload as string) : undefined,
    });

    done();
  });
};
