import { requestContext } from '@fastify/request-context';
import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { getInstanceByToken } from 'fastify-decorators';
import os from 'node:os';
import { env } from '../../lib/config/env';
import { Logger } from '../../lib/utils/logger';

const logger = getInstanceByToken<Logger>(Logger);

export const registerHooks = async (server: FastifyInstance) => {
  server.addHook('onRequest', (request, _, done) => {
    try {
      const requestId =
        (request.headers['X-Request-Id'] as string) ||
        (request.headers['x-request-id'] as string) ||
        '';

      if (!requestId) {
        request.headers['x-request-id'] = randomUUID();
      }
    } catch (error) {
      logger.error(error);
    } finally {
      done();
    }
  });

  server.addHook('preValidation', (request, _, done) => {
    try {
      const requestId = (request.headers['x-request-id'] as string) || '';
      const userId = (request.headers['x-id'] as string) || '';
      const userToken = (request.headers.authorization as string) || '';

      requestContext.set('requestId', requestId);
      requestContext.set('userId', userId);
      requestContext.set('userToken', userToken);
      requestContext.set('startTime', Date.now());

      logger.logRequest({
        hostname: os.hostname(),
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
    } catch (error) {
      logger.error(error);
    } finally {
      done();
    }
  });

  server.addHook('onSend', (_request, _reply, payload, done) => {
    requestContext.set('responsePayload', logger.parsePayload(payload as string));

    done();
  });

  server.addHook('preSerialization', (_, __, payload, done) => {
    try {
      if (typeof payload === 'object') {
        Object.assign(payload as object, {
          metadata: {
            request_id: requestContext.get('requestId') || '',
            hostname: os.hostname(),
            pid: process.pid,
          },
        });
      }
    } catch (error) {
      logger.error(error);
    } finally {
      done(null, payload);
    }
  });

  server.addHook('onSend', (request, reply, payload, done) => {
    try {
      const requestId =
        requestContext.get('requestId')! || (request.headers['x-request-id'] as string) || '';

      const userId = requestContext.get('userId')! || (request.headers['x-id'] as string) || '';

      const userToken =
        requestContext.get('userToken')! || (request.headers.authorization as string) || '';

      const startTime = requestContext.get('startTime')! || 0;

      const responseTime = Date.now() - startTime;

      logger.logResponse({
        hostname: os.hostname(),
        log_level: 'info',
        ctx: 'response-log',
        request_id: requestId,
        method: request.method.toUpperCase(),
        url: request.routerPath,
        user_id: userId,
        user_token: userToken,
        status_code: reply.statusCode,
        response_time: `${reply.getResponseTime() || responseTime} ms`,
        response: env.DEBUG_MODE ? logger.parsePayload(payload as string) : undefined,
      });
    } catch (error) {
      logger.error(error);
    } finally {
      done();
    }
  });
};
