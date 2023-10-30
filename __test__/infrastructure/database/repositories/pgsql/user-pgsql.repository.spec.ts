/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureServiceTest } from 'fastify-decorators/testing';
import { PgsqlConnection } from '../../../../../src/infrastructure/database/connections/pgsql.connection';
import { UserPgsqlRepository } from '../../../../../src/infrastructure/database/repositories/pgsql/user-pgsql.repository';

interface MockRepository {
  find: jest.Mock;
  findOne: jest.Mock;
  save: jest.Mock;
}

interface MockConnection {
  getRepository(): MockRepository;
  initialize: () => Promise<any>;
  destroy: () => Promise<any>;
}

describe('Repository: UserPgsqlReporitory', () => {
  let userPgsqlRepository: UserPgsqlRepository;
  let repository: MockRepository;

  beforeEach(async () => {
    repository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };
    userPgsqlRepository = configureServiceTest({
      service: UserPgsqlRepository,
      mocks: [
        {
          provide: PgsqlConnection,
          useValue: {
            connection: {
              getRepository: () => repository,
              initialize: () => Promise.resolve(),
            },
          } as Record<keyof PgsqlConnection, MockConnection>,
        },
      ],
    });

    await userPgsqlRepository.init();

    await new Promise(process.nextTick);
  });

  afterEach(() => jest.restoreAllMocks());

  it('UserPgsqlRepository.getAll should return array', async () => {
    repository.find.mockImplementation(() => Promise.resolve([]));

    const result = await userPgsqlRepository.getAll({});

    expect(result).toHaveLength(0);
  });

  it('UserPgsqlRepository.getOne should return null', async () => {
    repository.findOne.mockImplementation(() => Promise.resolve(null));

    const result = await userPgsqlRepository.getOne({});

    expect(result).toBeNull();
  });
});
