import { ValidationError } from '@nestjs/class-validator';
import {
  INestApplication,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { HttpExceptionsHandler } from './http-exceptions-handler';
import { loggerMiddleware } from './middleware/logger-http-request';
import { openApi } from './open-api.no-spec';

export async function mainConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
      transform: true,
      enableDebugMessages: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        throw new UnprocessableEntityException(validationErrors);
      },
    }),
  );

  app.use(loggerMiddleware);

  const httpRef = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new HttpExceptionsHandler(httpRef.httpAdapter.getHttpServer()),
  );

  if (process.env.NODE_ENV === 'test') return;
  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV === 'production') return;

  await openApi(app);
  await import('./generate-example-env');
  await import('./generate-process-env');
  await import('./generate-typescript-client');
}
