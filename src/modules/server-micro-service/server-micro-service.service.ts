import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ServerMicroServiceService {
  private readonly logger = new Logger(ServerMicroServiceService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  async pingPon(payload: any) {
    return { ...payload, message: 'pong' };
  }
}
