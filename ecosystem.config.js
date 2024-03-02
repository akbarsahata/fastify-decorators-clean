/* eslint-disable @typescript-eslint/no-var-requires */
const os = require('node:os');

module.exports = {
  apps: [
    {
      name: 'farming',
      script: 'dist/src/index.js',
      node_args: '-r dotenv/config --no-warnings',
      exec_mode: os.cpus().length > 1 ? 'cluster' : 'fork',
      instances: os.cpus().length,
      autorestart: true,
      watch: false,
      max_memory_restart: process.NODE_ENV === 'production' ? '2G' : '1G',
      error_file: '~/.pm2/logs/production-farming-error.log',
      out_file: '~/.pm2/logs/production-farming-out.log',
      kill_timeout: 30000,
      wait_ready: true,
    },
  ],
};
