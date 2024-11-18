import { randomUUID } from 'node:crypto';

import { Primitives } from './utility-types/to-primitive';

export class CreateEvent implements CreateEventInterface {
  constructor(payload: Primitives<CreateEvent>) {
    delete payload['nameEvent'];
    delete payload['id'];
    Object.assign(this, payload);
    this.id = randomUUID();
  }
  id?: string;
  nameEvent?: string[] | undefined;
  traceId: string;
  timestamp: number;
  origin?: string[] | undefined;

  toString() {
    return JSON.stringify(this, null, 2);
  }
}

export class CreateEventInterface {
  static nameEvent: Array<string> = [''];
  readonly nameEvent? = CreateEventInterface.nameEvent;
  readonly traceId: string;
  readonly timestamp: number;
  readonly origin?: Array<string>;
  readonly id?: string;
}
