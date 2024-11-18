import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
