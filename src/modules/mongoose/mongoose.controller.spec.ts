import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import request from 'supertest';

import { mainConfig } from '#/src/utils/main-config.no-spec';

import { MongooseController } from './mongoose.controller';
import { MongooseService } from './mongoose.service';
import { MongooseCollection, MongooseSchema } from './schema/schema';

describe('MongooseController', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let model: Model<MongooseCollection>;
  let controller: MongooseController;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    model = mongoConnection.model(MongooseCollection.name, MongooseSchema);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ScheduleModule.forRoot(),
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: MongooseCollection.name, schema: MongooseSchema },
        ]),
      ],
      controllers: [MongooseController],
      providers: [MongooseService],
    }).compile();

    app = module.createNestApplication();

    controller = app.get<MongooseController>(MongooseController);

    mainConfig(app);

    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(model).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('/POST should return status 412, body is not valid dto', async () => {
    const resp = await request(app.getHttpServer())
      .post('/mongoose')
      .send({ title: 'Title' })
      .set('Accept', 'application/json');

    expect(resp.status).toBe(422);
  });

  it('/POST should return status 201, body is valid dto', async () => {
    const resp = await request(app.getHttpServer())
      .post('/mongoose')
      .send({ label: 'Label', value: 'Value' })
      .set('Accept', 'application/json');

    expect(resp.status).toBe(201);
  });

  it('/GET should return status 200 and return array of rows', async () => {
    const resp = await request(app.getHttpServer())
      .get('/mongoose')
      .set('Accept', 'application/json');

    expect(resp.status).toBe(200);
    expect(resp.body).toEqual([
      expect.objectContaining({
        label: 'Label',
        value: 'Value',
      }),
    ]);
  });

  it('/UPDATE should return status 200 and update row', async () => {
    const get = async () =>
      await request(app.getHttpServer())
        .get('/mongoose')
        .set('Accept', 'application/json');

    const _ = await get();

    const patch = await request(app.getHttpServer())
      .patch(`/mongoose/${_.body[0]._id}`)
      .send({ label: 'Label 2', value: 'Value 2' })
      .set('Accept', 'application/json');

    expect(patch.status).toBe(200);

    const __ = await get();
    expect(__.body).toEqual([
      expect.objectContaining({
        label: 'Label 2',
        value: 'Value 2',
      }),
    ]);
  });

  it('/DELETE should return status 200 and delete row', async () => {
    const get = async () =>
      await request(app.getHttpServer())
        .get('/mongoose')
        .set('Accept', 'application/json');

    const _ = await get();

    const del = await request(app.getHttpServer())
      .delete(`/mongoose/${_.body[0]._id}`)
      .set('Accept', 'application/json');

    expect(del.status).toBe(200);

    const __ = await get();

    expect(__.body).toEqual([]);
  });

  it('should create backup of all database', async () => {
    const backup = await controller.backUp();

    expect(backup).toBeUndefined();
  });
});
