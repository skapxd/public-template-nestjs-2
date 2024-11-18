import {
  CreateEvent,
  CreateEventInterface,
} from '#/src/utils/create-event-interface';
import { Primitives } from '#/src/utils/utility-types/to-primitive';

export class AddedEvent extends CreateEvent implements CreateEventInterface {
  static nameEvent = ['added'];
  readonly nameEvent? = AddedEvent.nameEvent;

  result: number;

  constructor(payload: Primitives<AddedEvent>) {
    super(payload);
    Object.assign(this, payload);
  }
}
