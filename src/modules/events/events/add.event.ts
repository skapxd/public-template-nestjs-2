import {
  CreateEvent,
  CreateEventInterface,
} from '#/src/utils/create-event-interface';
import { Primitives } from '#/src/utils/utility-types/to-primitive';

export class AddEvent extends CreateEvent implements CreateEventInterface {
  static nameEvent = ['add'];
  readonly nameEvent? = AddEvent.nameEvent;

  arg1: number;
  arg2: number;

  constructor(payload: Primitives<AddEvent>) {
    super(payload);
    Object.assign(this, payload);
  }
}
