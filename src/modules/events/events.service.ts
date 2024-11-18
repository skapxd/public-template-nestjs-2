/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { AddEvent } from './events/add.event';
import { AddedEvent } from './events/added.event';

@Injectable()
export class EventsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async add(props: AddEvent) {
    await this.eventEmitter.emitAsync(
      AddedEvent.nameEvent,
      new AddedEvent({
        origin: props.nameEvent,
        timestamp: Date.now(),
        traceId: props.traceId,
        result: props.arg1 + props.arg2,
      }),
    );
  }
}
