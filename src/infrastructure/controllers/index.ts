import { FastifyInstance } from 'fastify';
import { bootstrap } from 'fastify-decorators';

console.log(__dirname);

export const registerControllers = async (server: FastifyInstance) => {
  server.register(bootstrap, {
    directory: __dirname,
    mask: /\.controller\./gi,
  });
};
