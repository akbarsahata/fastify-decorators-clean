/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
const NodeEnvironment = require('jest-environment-node');

class FastifyDecoratorsTestEnvironment extends NodeEnvironment {
  setup() {
    require('reflect-metadata');
    this.global.Reflect = Reflect;
    return super.setup();
  }
}

module.exports = FastifyDecoratorsTestEnvironment;
