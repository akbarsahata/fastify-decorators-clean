import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { FastifyInstance } from 'fastify';
import { registerControllers } from './controllers';
import { registerPlugins } from './plugins';
import { registerOtherHandlers } from './otherHandlers';
import { registerHooks } from './hooks';

export async function initServer(): Promise<FastifyInstance> {
  const server: FastifyInstance = Fastify({
    logger: false,
    pluginTimeout: 60000,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await registerPlugins(server);

  await registerHooks(server);

  await registerControllers(server);

  await registerOtherHandlers(server);

  return server;
}
