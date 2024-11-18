// @ts-check
import { Logger } from '@nestjs/common';

export const op = () => {
  const logger = new Logger(op.name);
  logger.verbose('inicio operación costosa');
  const t0 = performance.now();

  let total = 0;
  for (let i = 0; i < 5_000_000_000; i++) {
    total += i;
  }

  const tz = (performance.now() - t0) / 1_000;

  logger.verbose(`Call to doSomething took ${tz.toFixed(2)} sec.`);

  return total;
};
