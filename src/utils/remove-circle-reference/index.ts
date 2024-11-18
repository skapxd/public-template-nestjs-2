export const removeCircleReference = (obj: Record<string, any>) => {
  const cache: any[] = [];

  if (obj == null) return;

  const string = JSON.stringify(obj, (key, value) => {
    if (value instanceof Error) {
      return {
        message: value.message,
        stack: value.stack,
      };
    }

    if (typeof value === 'object' && value !== null) {
      if (cache.includes(value)) {
        return;
      }
      cache.push(value);
    }
    return value;
  });

  return JSON.parse(string);
};
