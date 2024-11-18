import { Controller, Inject, Logger } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';

import { MATH_SERVICE } from '#/src/utils/token-names';

import { ServerMicroServiceService } from './server-micro-service.service';

@Controller()
export class ServerMicroServiceController {
  private readonly logger = new Logger(ServerMicroServiceController.name);
  constructor(
    @Inject(MATH_SERVICE) private readonly client: ClientProxy,
    private readonly serverMicroService: ServerMicroServiceService,
  ) {}

  @MessagePattern('pin.pon')
  pinPon(@Payload() payload: any, @Ctx() context: RedisContext) {
    this.logger.log(`Received message from ${context.getChannel()}`);
    return this.serverMicroService.pingPon(payload);
  }

  @MessagePattern('pin.*')
  wildcard(@Payload() payload: any, @Ctx() context: RedisContext) {
    this.logger.log(`Received message from ${context.getChannel()}`);
    this.client.emit('response.any', payload);
  }
}
