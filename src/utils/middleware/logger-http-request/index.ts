import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger = new Logger('HTTP REQUEST');

  const { method, path } = req;

  if (process.env.NODE_ENV.match(/local|development|qa/)) {
    logger.debug(`${method} ${path}`);
  }

  next();
}
