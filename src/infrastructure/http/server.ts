import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { FastifyInstance } from 'fastify';
import { registerControllers } from '../controllers';
import { registerPlugins } from './plugins';

export async function initServer(): Promise<FastifyInstance> {
  const server: FastifyInstance = Fastify({
    logger: false,
    pluginTimeout: 60000,
  }).withTypeProvider<TypeBoxTypeProvider>();

  await registerPlugins(server);

  await registerControllers(server);

  return server;
}
