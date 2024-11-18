import { removeCircleReference } from '.';

describe('remove-circle-reference', () => {
  // Handles objects with no circular references correctly
  it('should return the same object when there are no circular references', () => {
    const obj = { a: 1, b: { c: 2 } };
    const result = removeCircleReference(obj);
    expect(result).toEqual(obj);
  });

  // Handles objects with circular references without throwing errors
  it('should handle circular references without throwing errors', () => {
    const obj: any = { a: 1 };
    obj.b = obj; // create circular reference
    const result = removeCircleReference(obj);
    expect(result).toEqual({ a: 1 });
  });

  // handle objects with error values
  it('should handle objects with error values', () => {
    const error = new Error('Test Error');
    const obj = { a: 1, b: { c: error } };
    const result = removeCircleReference(obj);
    expect(result).toEqual({
      a: 1,
      b: { c: { message: 'Test Error', stack: error.stack } },
    });
  });
});
