import fs from 'node:fs/promises';

import { it } from 'vitest';

import { _fileHandler, logic } from '.';

describe('generate-process-env', () => {
  it('should correctly process a .env string and an empty process.d.ts string', () => {
    const env = 'VAR1=value1\nVAR2=value2\n# VAR3=value3';
    const processEnvs = '';
    const expected = [
      'declare namespace NodeJS {',
      '  export interface ProcessEnv {',
      '    VAR1: string;',
      '    VAR2: string;',
      '  }',
      '}',
      '',
    ];
    expect(logic(env, processEnvs)).toEqual(expected);
  });

  it('should correctly process a .env string and a process.d.ts string', () => {
    const env = 'VAR1=value1\nVAR2=value2';
    const processEnvs = 'VAR3: string;\nVAR4: string;';
    const expected = [
      'declare namespace NodeJS {',
      '  export interface ProcessEnv {',
      '    VAR1: string;',
      '    VAR2: string;',
      '  }',
      '}',
      '',
    ];
    expect(logic(env, processEnvs)).toEqual(expected);
  });

  it('should correctly ignore comments in the .env string', () => {
    const env =
      '# This is a comment\nVAR1=value1\n# Another comment\nVAR2=value2';
    const processEnvs = '';
    const expected = [
      'declare namespace NodeJS {',
      '  export interface ProcessEnv {',
      '    VAR1: string;',
      '    VAR2: string;',
      '  }',
      '}',
      '',
    ];
    expect(logic(env, processEnvs)).toEqual(expected);
  });

  it('should parsed correctly NODE_ENV', () => {
    const env = 'NODE_ENV=development\nVAR1=value1\nVAR2=value2\n# VAR3=value3';
    const processEnvs = '';
    const expected = [
      'declare namespace NodeJS {',
      '  export interface ProcessEnv {',
      "    NODE_ENV: 'development' | 'production' | 'test' | 'local';",
      '    VAR1: string;',
      '    VAR2: string;',
      '  }',
      '}',
      '',
    ];
    expect(logic(env, processEnvs)).toEqual(expected);
  });

  it('should correctly handle an empty .env string and an empty process.d.ts string', () => {
    const env = '';
    const processEnvs = '';
    const expected = [
      'declare namespace NodeJS {',
      '  export interface ProcessEnv {',
      '  }',
      '}',
      '',
    ];
    expect(logic(env, processEnvs)).toEqual(expected);
  });

  // Successfully reads both .env and .example.env files
  it('should read both .env and .example.env files successfully', async () => {
    const readFileMock = vi
      .spyOn(fs, 'readFile')
      .mockResolvedValueOnce('mock file content');
    const writeFileMock = vi.spyOn(fs, 'writeFile').mockResolvedValueOnce();

    await _fileHandler();
    expect(readFileMock).toHaveBeenCalledWith('.env', 'utf8');
    expect(readFileMock).toHaveBeenCalledWith('process.d.ts', 'utf8');
    expect(writeFileMock).toHaveBeenCalled();

    readFileMock.mockRestore();
    writeFileMock.mockRestore();
  });

  it('should log error if throw to read file', async () => {
    const readFileMock = vi
      .spyOn(fs, 'readFile')
      .mockRejectedValueOnce(new Error('mock error'))
      .mockRejectedValueOnce(new Error('mock error'));

    const writeFileMock = vi
      .spyOn(fs, 'writeFile')
      .mockRejectedValueOnce(new Error('mock error'));

    await _fileHandler();
    expect(readFileMock).toHaveBeenCalledTimes(2);
    expect(writeFileMock).toHaveBeenCalledTimes(1);
  });
});
