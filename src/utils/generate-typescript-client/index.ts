import { readFile, watch } from 'node:fs/promises';
import path, { join } from 'node:path';

import { Logger } from '@nestjs/common';
import { generateApi } from 'swagger-typescript-api';

const swaggerPath = join(process.cwd(), 'public', 'swagger.json');

const logger = new Logger('swagger-typescript-client');

const webHook = async () => {
  try {
    const swaggerString = await readFile(swaggerPath, 'utf-8');
    const swaggerJson = JSON.parse(swaggerString);

    await generateApi({
      output: path.resolve(process.cwd(), '__generated__'),
      spec: swaggerJson,
      addReadonly: true,
      httpClientType: 'fetch',
      modular: true,
      silent: true,
    });

    const url = new URL(
      'api/generate-request-from-swagger',
      process.env.URL_FRONT || 'http://localhost:3000',
    );

    await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: swaggerJson,
    });
  } catch (error) {
    logger.error('Error on call back', error);
  }
};

(async () => {
  const watcher = watch(swaggerPath);

  await webHook();
  logger.log('swagger client http file created');

  for await (const {} of watcher) {
    await webHook();
    logger.log('swagger client http file updated');
  }
})();
