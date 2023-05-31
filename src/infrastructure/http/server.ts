import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import Fastify, { FastifyInstance } from 'fastify';

export async function initServer(): Promise<FastifyInstance> {
  const server: FastifyInstance = Fastify({
    logger: false,
    pluginTimeout: 60000,
  }).withTypeProvider<TypeBoxTypeProvider>();

  return server;
}
