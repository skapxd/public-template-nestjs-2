import { deepNormalizeProperty, normalizeString } from '.';

describe('normalizeString', () => {
  it('should remove diacritic marks from a string', () => {
    const str = 'Mëtàl Hëàd';
    const expected = 'Metal Head';
    expect(normalizeString(str)).toBe(expected);
  });
});

describe('deepNormalizeProperty', () => {
  it('should remove diacritic marks from string properties of an object', () => {
    const obj = { name: 'Mëtàl Hëàd', genre: 'Hëàvy Mëtàl' };
    const expected = { name: 'Metal Head', genre: 'Heavy Metal' };
    expect(deepNormalizeProperty(obj)).toEqual(expected);
  });

  it('should remove diacritic marks from string properties of nested objects', () => {
    const obj = { band: { name: 'Mëtàl Hëàd', genre: 'Hëàvy Mëtàl' } };
    const expected = { band: { name: 'Metal Head', genre: 'Heavy Metal' } };
    expect(deepNormalizeProperty(obj)).toEqual(expected);
  });

  it('should remove diacritic marks from string properties of objects in an array', () => {
    const arr = [
      { name: 'Mëtàl Hëàd', genre: 'Hëàvy Mëtàl' },
      { name: 'Röck Stàr', genre: 'Hàrd Röck' },
    ];
    const expected = [
      { name: 'Metal Head', genre: 'Heavy Metal' },
      { name: 'Rock Star', genre: 'Hard Rock' },
    ];
    expect(deepNormalizeProperty(arr)).toEqual(expected);
  });
});
