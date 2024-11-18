import { expect } from 'vitest';

expect.extend({
  toValidate<T>(received: T, predicate: (value: T) => boolean) {
    const pass = predicate(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to pass the predicate`,
        pass: true,

        actual: false,
        expected: false,
      };
    } else {
      return {
        message: () => `expected ${received} to pass the predicate`,
        pass: false,
        actual: false,
        expected: false,
      };
    }
  },
});
