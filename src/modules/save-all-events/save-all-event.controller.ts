/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller } from '@nestjs/common';

import { TestEvent } from './event/test.event';
import { SaveAllEventService } from './save-all-event.service';

@Controller()
export class SaveAllEventController {
  constructor(private readonly saveAllEventService: SaveAllEventService) {}

  // @OnEvent('**', { async: true })
  async handleAllEvents(event: TestEvent) {
    return await this.saveAllEventService.save(event);
  }
}
