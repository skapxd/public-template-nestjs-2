import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  Inject,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';

import { getErrorDetail } from '../get-error-detail';
import { removeCircleReference } from '../remove-circle-reference';

@Catch()
export class HttpExceptionsHandler extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionsHandler.name);

  constructor(@Inject(HttpAdapterHost) applicationRef: HttpServer) {
    super(applicationRef);
  }

  async catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    const { url, method, headers, body } = request;

    try {
      const errorDetail = (() => {
        if (exception instanceof Error) {
          return getErrorDetail(exception);
        }

        if ('errorDetail' in exception) {
          return exception['errorDetail'];
        }

        throw new Error('ErrorDetail not found');
      })();

      const responseDetail = (() => {
        if (exception instanceof HttpException) return exception.getResponse();
        if ('message' in exception) return exception['message'];

        throw new Error('ResponseDetail not found');
      })();

      const status = (() => {
        if (exception instanceof HttpException) return exception.getStatus();
        if ('status' in exception) return exception['status'] as number;

        throw new Error('Status not found');
      })();

      const log = {
        errorDetail: process.env.NODE_ENV === 'production' ? '' : errorDetail,
        responseDetail,
        microserviceCall: exception['call'],
        url: `${method} -> ${url}`,
        status,
        body,
        headers,
      };

      const isDtoValidation = exception instanceof UnprocessableEntityException;
      if (!isDtoValidation) {
        this.logger.log('TODO: save report message');
      }

      this.logger.error(log);

      return response.status(status).json(log);
    } catch (error) {
      if (error && typeof error === 'object') {
        return response.status(501).json({
          url: `${method} -> ${url}`,
          body,
          errorPath: 'libs/common/src/utils/http-exceptions-handler/index.ts',
          errorDetail: removeCircleReference(error),
        });
      }

      return response.status(501).json({
        url: `${method} -> ${url}`,
        body,
        errorPath: 'libs/common/src/utils/http-exceptions-handler/index.ts',
        errorDetail: error,
      });
    }
  }
}
