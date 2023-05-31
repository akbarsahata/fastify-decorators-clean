import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { fastifyRequestContext } from '@fastify/request-context';
import fasitfySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import multer from 'fastify-multer';
import pkg from '../../../package.json';
import { env } from '../../lib/config/env';

let HOST = 'localhost';
let SCHEMES = ['http'];

if (env.isDev) {
  HOST = 'localhost:' + env.APP_PORT;
  SCHEMES = ['http'];
} else if (env.isProd) {
  HOST = env.APP_URL;
  SCHEMES = ['https'];
}

export const registerPlugins = async (server: FastifyInstance) => {
  await server.register(fastifyRequestContext, {
    defaultStoreValues: {
      requestId: '',
      userId: '',
      userToken: '',
      startTime: Date.now(),
    },
  });

  await server.register(cors, { origin: '*' });
  await server.register(helmet, { global: true });
  await server.register(multer.contentParser);
  await server.register(fasitfySwagger, {
    swagger: {
      info: {
        title: env.APP_NAME + ' swagger',
        description: env.APP_NAME + ' REST API documentation',
        version: pkg.version,
      },
      host: HOST,
      schemes: SCHEMES,
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Authorization: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
      security: [
        {
          Authorization: [],
        },
      ],
    },
  });

  await server.register(fastifySwaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'none',
      deepLinking: true,
      persistAuthorization: true,
    },
    uiHooks: {
      onRequest: function onRequest(_, __, next) {
        next();
      },
      preHandler: function preHandler(_, __, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => swaggerObject,
    transformSpecificationClone: true,
  });
};
