/* eslint-disable max-classes-per-file */

import { requestContext } from '@fastify/request-context';
import { Service } from 'fastify-decorators';
import pino from 'pino';
import { Logger as TypeORMLogger } from 'typeorm';
import { env } from '../../lib/config/env';
import {
  ErrorLog,
  MqttMessageLog,
  QueryErrorLog,
  QueryLog,
  QuerySlowLog,
  RequestLog,
  ResponseLog,
} from '../types/logger.d';

@Service('AppLogger')
export class Logger {
  private logger = pino({
    level: env.DEBUG_MODE ? 'debug' : 'info',
    ...(env.isDev && {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
    }),
  });

  info(obj: any, msg?: string) {
    if (env.isTest) return;
    this.logger.info(obj, msg);
  }

  debug(obj: any, msg?: string) {
    this.logger.debug(obj, msg);
  }

  warn(obj: any, msg?: string) {
    this.logger.warn(obj, msg);
  }

  error(obj: any, msg?: string) {
    this.logger.error(obj, msg);
  }

  logRequest(data: RequestLog) {
    this.info({
      ...data,
    });
  }

  logResponse(data: ResponseLog) {
    this.info({
      ...data,
    });
  }

  logError(data: ErrorLog) {
    this.error({
      ...data,
    });
  }

  logQuery(data: QueryLog) {
    this.debug({
      ...data,
      query: data.query.replace(/"/gi, ''),
      params: data.params ? JSON.parse(data.params as any) : [],
    });
  }

  logQueryError(data: QueryErrorLog) {
    this.debug({
      ...data,
      query: data.query.replace(/"/gi, ''),
      params: data.params ? JSON.parse(data.params as any) : [],
    });
  }

  logQuerySlow(data: QuerySlowLog) {
    this.debug({
      ...data,
      query: data.query.replace(/"/gi, ''),
      params: data.params ? JSON.parse(data.params as any) : [],
    });
  }

  logMqttMessage(data: MqttMessageLog) {
    this.info({
      ...data,
      meta: env.DEBUG_MODE && data.meta,
      payload: env.DEBUG_MODE && this.parseBufferPayload(data.payload),
    });
  }

  // eslint-disable-next-line class-methods-use-this
  parsePayload(data: any) {
    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  parseBufferPayload(data: any) {
    try {
      if (data instanceof Buffer) {
        return data.toString('hex');
      }
      return data;
    } catch (error) {
      return data;
    }
  }
}

@Service('DBLogger')
export class DBLogger implements TypeORMLogger {
  private logger = new Logger();

  logQuery(query: string, parameters?: any[] | undefined) {
    this.logger.logQuery({
      log_level: 'debug',
      ctx: 'query-log',
      request_id: requestContext.get('requestId') || '',
      query,
      params: this.stringifyParams(parameters),
    });
  }

  logQueryError(error: string | Error, query: string, parameters?: any[] | undefined) {
    this.logger.logQueryError({
      log_level: 'debug',
      ctx: 'query-error-log',
      request_id: requestContext.get('requestId') || '',
      error,
      query,
      params: this.stringifyParams(parameters),
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[] | undefined) {
    this.logger.logQuerySlow({
      log_level: 'debug',
      ctx: 'query-slow-log',
      request_id: requestContext.get('requestId') || '',
      time,
      query,
      params: this.stringifyParams(parameters),
    });
  }

  logSchemaBuild(message: string) {
    this.logger.debug({ message });
  }

  logMigration(message: string) {
    this.logger.debug({ message });
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    const doLog = {
      log: () => {
        this.logger.debug({ message });
      },
      info: () => {
        this.logger.info({ message });
      },
      warn: () => {
        this.logger.warn({ message });
      },
    };

    doLog[level]();
  }

  // eslint-disable-next-line class-methods-use-this
  stringifyParams(parameters: any) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      return parameters;
    }
  }
}
