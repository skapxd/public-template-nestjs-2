/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EventsService } from './events.service';
import { AddEvent } from './events/add.event';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @OnEvent(AddEvent.nameEvent, { async: true })
  async handleAddEvent(props: AddEvent) {
    return await this.eventsService.add(props);
  }
}
