import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { connectionName1, database } from './const';
import { EventsEntity } from './entities/events.entity';
import { SaveAllEventController } from './save-all-event.controller';
import { SaveAllEventService } from './save-all-event.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: connectionName1,
      type: 'better-sqlite3',
      database,
      synchronize: true,
      dropSchema: true,
      entities: [EventsEntity],
    }),
    TypeOrmModule.forFeature([EventsEntity], connectionName1),
  ],
  controllers: [SaveAllEventController],
  providers: [SaveAllEventService],
})
export class SaveAllEventModule {}
