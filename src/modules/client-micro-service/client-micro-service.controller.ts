import { Controller, Inject, Param, Post, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { fromEvent, map } from 'rxjs';

import { MATH_SERVICE } from '#/src/utils/token-names';

@Controller('client-micro-service')
export class ClientMicroServiceController {
  constructor(
    @Inject(MATH_SERVICE) private readonly client: ClientProxy,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post(':id')
  post(@Param('id') id: string) {
    return this.client.send('pin.pon', { id });
  }

  @MessagePattern('response.*')
  listenMicroServicesEvents(
    @Payload() payload: any,
    @Ctx() context: RedisContext,
  ) {
    this.eventEmitter.emit('response.start', {
      event: context.getArgs().join(','),
      data: payload,
    });
  }

  @Sse('events')
  sse() {
    return fromEvent(this.eventEmitter, 'response.*').pipe(
      map((_: any) => {
        return {
          event: _?.event,
          data: _?.data,
        };
      }),
    );
  }
}
