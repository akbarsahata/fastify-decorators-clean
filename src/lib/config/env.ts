import { bool, cleanEnv, num, port, str } from 'envalid';

import pkg from '../../../package.json';

export const env = cleanEnv(process.env, {
  APP_NAME: str(),
  APP_VERSION: str({ default: pkg.version }),
  APP_PORT: port({ default: 8080 }),
  APP_URL: str({ default: 'localhost' }),
  APP_HOST: str({ default: '0.0.0.0' }),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  DEBUG_MODE: bool({ default: false }),
  OTP_EXPIRY_MINUTES: num({ default: 2 }),
});

export const psqlEnv = cleanEnv(process.env, {
  PGSQL_DB: str(),
  PGSQL_HOST: str(),
  PGSQL_PORT: port({ default: 5432 }),
  PGSQL_USERNAME: str(),
  PGSQL_PASSWORD: str(),
  PGSQL_SCHEMA: str(),
  PGSQL_LOG: bool({ default: false }),
});
