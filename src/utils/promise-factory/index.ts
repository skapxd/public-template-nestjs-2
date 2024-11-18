export const promiseFactory = <T>() =>
  (() => {
    let resolve: (value: unknown) => void;
    let reject: (reason: unknown) => void;

    const promise: Promise<T> = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    // @ts-expect-error: ERR
    return { promise, resolve, reject };
  })();
