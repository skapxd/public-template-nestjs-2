import { resolve } from 'node:path';

import { Injectable, Logger } from '@nestjs/common';
import Piscina from 'piscina';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);
  private counter = 0;

  addCounter() {
    return this.counter++;
  }

  cron() {
    const filename = resolve(__dirname, './op.mjs');

    const task = new Piscina({
      filename,
    });

    task.run({}, { name: 'op' }).then((res) => {
      this.logger.log(`Respuesta de la operación costosa: ${res}`);
    });
  }
}
