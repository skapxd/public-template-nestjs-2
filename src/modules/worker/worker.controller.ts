import { Controller, Get } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { WorkerService } from './worker.service';

@Controller('worker')
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Get()
  addCounter() {
    return this.workerService.addCounter();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  cron() {
    this.workerService.cron();
  }
}
