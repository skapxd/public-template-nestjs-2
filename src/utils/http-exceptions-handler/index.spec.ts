import {
  BadRequestException,
  Controller,
  Get,
  INestApplication,
  Module,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpExceptionsHandler } from '.';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpAdapterHost } from '@nestjs/core';
import request from 'supertest';

@Controller()
class ControllerForTest {
  @Get('badRequest')
  async badRequest(): Promise<string> {
    throw new BadRequestException('Test Error message for BadRequestException');
  }

  @Get('unauthorized')
  async unauthorized(): Promise<string> {
    throw new UnauthorizedException(
      'Test Error message for UnauthorizedException',
    );
  }

  @Get('internalServerError')
  async internalServerError(): Promise<string> {
    throw new Error('Test Error message for internalServerError');
  }

  @Get('microserviceError')
  async microserviceError(): Promise<string> {
    throw {
      errorDetail: 'errorDetail: Test Error message for microserviceError',
      message: 'message: Test Error message for microserviceError',
      status: 500,
    };
  }
}

@Module({ controllers: [ControllerForTest] })
class ModuleForTest {}

describe('http-exceptions-handler', () => {
  let app: INestApplication;
  let controller: ControllerForTest;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ModuleForTest],
    }).compile();

    app = moduleRef.createNestApplication();

    const httpRef = app.get(HttpAdapterHost);
    app.useGlobalFilters(
      new HttpExceptionsHandler(httpRef.httpAdapter.getHttpServer()),
    );

    controller = moduleRef.get<ControllerForTest>(ControllerForTest);

    await app.init();
  });

  it('should define', () => {
    expect(app).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('should catch badRequest error', async () => {
    const resp = await request(app.getHttpServer()).get('/badRequest');

    expect(resp.status).toBe(400);
    expect(resp.body).toMatchObject({
      responseDetail: expect.any(Object),
      body: expect.any(Object),
      headers: expect.any(Object),
      status: 400,
      url: 'GET -> /badRequest',
      errorDetail: expect.stringContaining(
        'BadRequestException: Test Error message for BadRequestException ->',
      ),
    });
  });

  it('should catch unauthorized error', async () => {
    const resp = await request(app.getHttpServer()).get('/unauthorized');

    expect(resp.status).toBe(401);
    expect(resp.body).toMatchObject({
      responseDetail: expect.any(Object),
      body: expect.any(Object),
      headers: expect.any(Object),
      status: 401,
      url: 'GET -> /unauthorized',
      errorDetail: expect.stringContaining(
        'UnauthorizedException: Test Error message for UnauthorizedException ->',
      ),
    });
  });

  it('should catch internalServerError error', async () => {
    const resp = await request(app.getHttpServer()).get('/internalServerError');

    expect(resp.status).toBe(501);
    expect(resp.body).toMatchObject({
      body: expect.any(Object),
      errorPath: 'libs/common/src/utils/http-exceptions-handler/index.ts',
      url: 'GET -> /internalServerError',
      errorDetail: expect.any(Object),
    });
  });

  it('should catch microserviceError error', async () => {
    const resp = await request(app.getHttpServer()).get('/microserviceError');

    expect(resp.status).toBe(500);
    expect(resp.body).toMatchObject({
      responseDetail: 'message: Test Error message for microserviceError',
      body: expect.any(Object),
      headers: expect.any(Object),
      status: 500,
      url: 'GET -> /microserviceError',
      errorDetail: expect.stringContaining(
        'errorDetail: Test Error message for microserviceError',
      ),
    });
  });
});
