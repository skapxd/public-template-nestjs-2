import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { mainConfig } from '#/src/utils/main-config.no-spec';

import { WorkerModule } from './worker.module';

describe('WorkerController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [WorkerModule],
    }).compile();

    app = module.createNestApplication();

    mainConfig(app);

    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should return Hello World!', async () => {
    await request(app.getHttpServer()).get('/worker').expect(200);

    const resp = await request(app.getHttpServer()).get('/worker').expect(200);

    expect(resp.text).toBe('1');
  });
});
