import { Logger } from '@nestjs/common';
import { vi } from 'vitest';

import { loggerMiddleware } from '.';

describe('loggerMiddleware', () => {
  beforeAll(() => {
    vi.mock('@nestjs/common', () => {
      const debug = vi.fn();

      class Logger {
        debug = debug;
      }

      return {
        Logger,
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each(['local', 'development', 'qa'] as const)(
    'should call logger where NODE_ENV is equal to `local || development || qa`',
    (env) => {
      // @ts-expect-error: We mock Req and Res for testing purposes
      process.env.NODE_ENV = env;

      // @ts-expect-error: We mock Req and Res for testing purposes
      loggerMiddleware({}, {}, () => null);

      const logger = new Logger('HTTP REQUEST');
      expect(logger.debug).toHaveBeenCalledTimes(1);
    },
  );

  it.each(['production', 'staging'])(
    'should not call logger where NODE_ENV is equal to `production || staging`',
    (env) => {
      // @ts-expect-error: We mock Req and Res for testing purposes
      process.env.NODE_ENV = env;

      // @ts-expect-error: We mock Req and Res for testing purposes
      loggerMiddleware({}, {}, () => null);

      const logger = new Logger('HTTP REQUEST');
      expect(logger.debug).not.toHaveBeenCalled();
    },
  );
});
