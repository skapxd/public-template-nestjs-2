export const normalizeString = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const deepNormalizeProperty = (
  obj: Record<string, any>,
): Record<string, any> => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const newObj = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (typeof value === 'string') {
        newObj[key] = normalizeString(value);
      } else {
        newObj[key] = deepNormalizeProperty(value);
      }
    }
  }

  return newObj;
};
