import { bool, cleanEnv, port, str } from 'envalid';

import pkg from '../../../package.json';

export const env = cleanEnv(process.env, {
  APP_NAME: str(),
  APP_VERSION: str({ default: pkg.version }),
  APP_PORT: port({ default: 8080 }),
  APP_URL: str({ default: 'localhost' }),
  APP_HOST: str({ default: '0.0.0.0' }),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  DEBUG_MODE: bool({ default: false }),
});
