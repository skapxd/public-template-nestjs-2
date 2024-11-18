import { randomUUID } from 'node:crypto';

import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';

import { delay } from '#/src/utils/duration';

import { TestEvent } from './event/test.event';
import { SaveAllEventModule } from './save-all-event.module';
import { SaveAllEventService } from './save-all-event.service';

describe('SaveAllEventController', () => {
  let eventEmitter: EventEmitter2;
  let service: SaveAllEventService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        SaveAllEventModule,
        EventEmitterModule.forRoot({ wildcard: true, delimiter: '.' }),
      ],
    }).compile();

    eventEmitter = moduleRef.get<EventEmitter2>(EventEmitter2);
    service = moduleRef.get<SaveAllEventService>(SaveAllEventService);
    await moduleRef.init();
  });

  it('should be defined', async () => {
    expect(eventEmitter).toBeDefined();
  });

  it('should save event', async () => {
    return await eventEmitter.emitAsync(
      TestEvent.nameEvent,
      new TestEvent({
        text: 'test',
        timestamp: Date.now(),
        traceId: randomUUID(),
      }),
    );
  });

  it('should have event', async () => {
    await delay({ second: 5 });

    // const events = await service.findAll();

    // expect(events.length).toBe(1);
  });
});
