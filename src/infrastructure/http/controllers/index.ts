import { FastifyInstance } from 'fastify';
import { bootstrap } from 'fastify-decorators';
import HealthController from './health.controller';
import OtpController from './otp.controller';
import ProductController from './product.controller';

export const registerControllers = async (server: FastifyInstance) => {
  server.register(bootstrap, {
    controllers: [HealthController, OtpController, ProductController],
  });
};
