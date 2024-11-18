import { logic } from '.';

describe('generate-example-env', () => {
  it('should correctly handle a .env string with multiple equal signs', () => {
    const env = 'VAR1=value1=value2\nVAR2=value2';
    const exampleEnvs = '';
    const expected = ['VAR1=""', 'VAR2=""'];
    expect(logic(env, exampleEnvs)).toStrictEqual(expected);
  });

  it('should correctly handle a .env string with spaces around equal signs', () => {
    const env = 'VAR1 = value1\nVAR2=value2';
    const exampleEnvs = '';
    const expected = ['VAR1=""', 'VAR2=""'];
    expect(logic(env, exampleEnvs)).toStrictEqual(expected);
  });

  it('should correctly handle a .env string with empty values', () => {
    const env = 'VAR1=\nVAR2=value2';
    const exampleEnvs = '';
    const expected = ['VAR1=""', 'VAR2=""'];
    expect(logic(env, exampleEnvs)).toStrictEqual(expected);
  });

  it('should correctly handle a .env string with no equal signs', () => {
    const env = 'VAR1\nVAR2=value2';
    const exampleEnvs = '';
    const expected = ['VAR1=""', 'VAR2=""'];
    expect(logic(env, exampleEnvs)).toStrictEqual(expected);
  });

  it('should correctly handle a .example.env string with no equal signs', () => {
    const env = 'VAR1=value1\nVAR2=value2';
    const exampleEnvs = 'VAR3\nVAR4';
    const expected = ['VAR1=""', 'VAR2=""'];
    expect(logic(env, exampleEnvs)).toStrictEqual(expected);
  });

  it('should correctly handle a .example.env string with empty values', () => {
    const env = 'VAR1=value1\nVAR2=value2';
    const exampleEnvs = 'VAR3=\nVAR4=""';
    const expected = ['VAR1=""', 'VAR2=""'];
    expect(logic(env, exampleEnvs)).toStrictEqual(expected);
  });

  it('should no be affected by order of envs', () => {
    const env = 'VAR1=value1\nVAR2=value2';
    const exampleEnvs = 'VAR2=""\nVAR1=""';
    const expected = ['VAR2=""', 'VAR1=""'];
    expect(logic(env, exampleEnvs)).toStrictEqual(expected);
  });
});
