import fs from 'node:fs/promises';
import { join } from 'node:path';

import { Logger } from '@nestjs/common';

import { getLoggerName } from '../get-logger-name';

const name = getLoggerName(__dirname);
const logger = new Logger(name);

export const logic = (fileEnv: string, fileProcessEnvs = '') => {
  const fileEnvAsArr = fileEnv
    .split(/\n|\r/)
    .map((line) => line.trim())
    .map((line) => (line.startsWith('#') ? '' : line))
    .filter(Boolean)
    .map((line) => line.split('=')[0] + ': string;')
    .map((line) =>
      line === 'NODE_ENV: string;'
        ? "NODE_ENV: 'development' | 'production' | 'test' | 'local';"
        : line,
    );

  const fileProcessEnvsAsArr = fileProcessEnvs
    .split(/\n|\r/)
    .map((line) => line.trim())
    .filter((e) => e.match(':'));

  for (const line of fileEnvAsArr) {
    const hasLine = fileProcessEnvsAsArr.includes(line);
    if (!hasLine) fileProcessEnvsAsArr.push(line);
  }

  for (const line of [...fileProcessEnvsAsArr]) {
    const hasLine = fileEnvAsArr.includes(line);
    const index = fileProcessEnvsAsArr.indexOf(line);
    if (!hasLine) fileProcessEnvsAsArr.splice(index, 1);
  }

  const template = [
    'declare namespace NodeJS {',
    '  export interface ProcessEnv {',
    ...fileProcessEnvsAsArr.map((line) => '    ' + line),
    '  }',
    '}',
    '',
  ];

  return template;
};

/**
 * ## Not use this function
 * ---
 * ### This function is exported only for testing
 */
export const _fileHandler = async () => {
  const fileEnv = await fs.readFile('.env', 'utf8').catch(() => {
    logger.error('Error: .env file not found');
    return '';
  });

  const fileExampleEnv = await fs.readFile('process.d.ts', 'utf8').catch(() => {
    logger.error('Error: process.d.ts file not found');
    return '';
  });

  const template = logic(fileEnv, fileExampleEnv);

  if (template.length === 0) return;

  await fs.writeFile('process.d.ts', template.join('\n')).catch(() => {
    logger.error('Error: process.d.ts file not created');
  });
};

(async () => {
  if (process.env.NODE_ENV === 'test') return;

  // Execute when the program start
  await _fileHandler();
  logger.log('process.d.ts file created');

  const watcher = fs.watch(join(process.cwd(), '.env'));
  for await (const {} of watcher) {
    // Execute when the file .env change
    await _fileHandler();
    logger.log('.process.d.ts file updated');
  }
})();
