import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';

import { mainConfig } from '#/src/utils/main-config.no-spec';

import { database } from './const';
import { TypeormEntity } from './entities/typeorm.entity';
import { TypeormController } from './typeorm.controller';
import { TypeormService } from './typeorm.service';

describe('TypeormController', () => {
  let app: INestApplication;
  let repository: Repository<TypeormEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          database: database,
          type: 'better-sqlite3',
          synchronize: true,
          dropSchema: true,
          entities: [TypeormEntity],
        }),
        TypeOrmModule.forFeature([TypeormEntity]),
      ],
      controllers: [TypeormController],
      providers: [TypeormService],
    }).compile();

    repository = module.get(getRepositoryToken(TypeormEntity));

    app = module.createNestApplication();

    mainConfig(app);

    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('/POST should return status 412, body is not valid dto', async () => {
    const resp = await request(app.getHttpServer())
      .post('/typeorm')
      .send({ title: 'Title' })
      .set('Accept', 'application/json');

    expect(resp.status).toBe(422);
  });

  it('/POST should return status 201, body is valid dto', async () => {
    const resp = await request(app.getHttpServer())
      .post('/typeorm')
      .send({ label: 'Label', value: 'Value' })
      .set('Accept', 'application/json');

    expect(resp.status).toBe(201);
  });

  it('/GET should return status 200 and return array of rows', async () => {
    const resp = await request(app.getHttpServer())
      .get('/typeorm')
      .set('Accept', 'application/json');

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual([
      expect.objectContaining({
        id: expect.any(Number),
        label: 'Label',
        value: 'Value',
      }),
    ]);
  });

  it('/UPDATE should return status 200 and update row', async () => {
    const get = async () =>
      await request(app.getHttpServer())
        .get('/typeorm')
        .set('Accept', 'application/json');

    let _get = await get();

    const patch = await request(app.getHttpServer())
      .patch(`/typeorm/${_get.body[0].id}`)
      .send({ label: 'Label 2', value: 'Value 2' })
      .set('Accept', 'application/json');

    expect(patch.status).toBe(200);

    _get = await get();
    expect(_get.body).toEqual([
      expect.objectContaining({
        id: expect.any(Number),
        label: 'Label 2',
        value: 'Value 2',
      }),
    ]);
  });

  it.skip('/DELETE should return status 200 and delete row', async () => {
    const get = async () =>
      await request(app.getHttpServer())
        .get('/typeorm')
        .set('Accept', 'application/json');

    let _get = await get();

    const del = await request(app.getHttpServer())
      .delete(`/typeorm/${_get.body[0].id}`)
      .set('Accept', 'application/json');

    expect(del.status).toBe(200);

    _get = await get();

    expect(_get.body).toEqual([]);
  });
});
