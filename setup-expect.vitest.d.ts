import 'vitest';

interface CustomMatchers<R = unknown> {
  toValidate: (predicate: (value: any) => boolean) => R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
