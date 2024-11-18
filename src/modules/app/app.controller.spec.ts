import { INestApplication } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { MessageSendedEvent } from '#/src/utils/events/app.event';
import { mainConfig } from '#/src/utils/main-config.no-spec';

import { AppController } from './app.controller';
import { AppModule } from './app.module';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: INestApplication;
  let emitter: EventEmitter2;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = module.createNestApplication();
    emitter = module.get<EventEmitter2>(EventEmitter2);

    mainConfig(app);

    await app.init();
  });

  it('should to be defined', () => {
    expect(app).toBeDefined();
    expect(emitter).toBeDefined();
  });

  it('should send event', async () => {
    emitter.on(
      MessageSendedEvent.nameEvent,
      (event: MessageSendedEvent) => {
        expect(event.nameEvent).toStrictEqual(MessageSendedEvent.nameEvent);
      },
      { async: true },
    );

    const resp = await request(app.getHttpServer())
      .post('/')
      .send({ phone: '573000000000', message: 'Hello world' })
      .set('Accept', 'application/json')
      .set('Authorization', 'Bearer ' + process.env.API_SECRET);

    expect(resp.status).toBe(201);
  });

  it('should return same of body', async () => {
    const body = {
      phone: '573000000000',
      message: 'Hello world',
    };

    const resp = await request(app.getHttpServer())
      .post('/')
      .send(body)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + process.env.API_SECRET);

    expect(resp.body).toStrictEqual(body);
  });

  it('should return 401 if Bearer is not provided', async () => {
    const resp = await request(app.getHttpServer())
      .post('/')
      .send({
        phone: '573000000000',
        message: 'Hello world',
      })
      .set('Content-Type', 'application/json');

    expect(resp.status).toBe(401);
  });

  it('should return 401 if Bearer is not same of env', async () => {
    const resp = await request(app.getHttpServer())
      .post('/')
      .send({
        phone: '573000000000',
        message: 'Hello world',
      })
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + 'any toke diff to env');

    expect(resp.status).toBe(401);
  });

  it('should return all messages', async () => {
    const body = {
      phone: '573000000000',
    };

    const resp = await request(app.getHttpServer())
      .get('/')
      .query(body)
      .set('Authorization', 'Bearer ' + process.env.API_SECRET);

    expect(resp.body).toStrictEqual([
      {
        phone: '573000000000',
        message: 'Hello world',
      },
    ]);
  });

  it('should validate roles', async () => {
    const resp = await request(app.getHttpServer())
      .get('/roles')
      .set('Authorization', 'Bearer ' + process.env.API_SECRET);

    expect(resp.status).toBe(404);
  });
});
