import { CreateEvent } from '#/src/utils/create-event-interface';
import { Primitives } from '#/src/utils/utility-types/to-primitive';

export class TestEvent extends CreateEvent {
  static nameEvent = ['test'];
  readonly nameEvent? = TestEvent.nameEvent;

  text: string;

  constructor(payload: Primitives<TestEvent>) {
    super(payload);
    Object.assign(this, payload);
  }
}
