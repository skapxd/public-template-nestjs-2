import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CreateEvent } from '#/src/utils/create-event-interface';

import { connectionName1 } from './const';
import { EventsEntity } from './entities/events.entity';

@Injectable()
export class SaveAllEventService {
  constructor(
    @InjectEntityManager(connectionName1)
    private entityManager1: EntityManager,
  ) {}

  async save(event: CreateEvent) {
    await this.entityManager1
      .createQueryBuilder()
      .insert()
      .into(EventsEntity)
      .values({
        traceUUID: event.traceId,
        timestamp: event.timestamp,
        nameEvent: event.nameEvent?.join() ?? '',
        payload: JSON.stringify(event),
      })
      .execute();

    return;
  }

  async findAll() {
    return await this.entityManager1.find(EventsEntity);
  }
}
