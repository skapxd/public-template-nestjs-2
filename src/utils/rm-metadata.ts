import { rm } from 'node:fs/promises';

import { Logger } from '@nestjs/common';

const name = __filename.replaceAll('\\', '/').split('/').pop() ?? '';
const logger = new Logger(name);

(async () => {
  const v = await rm('src/metadata.ts').catch(() => {
    logger.error('Error: metadata.ts file not found');
    return '';
  });

  if (v !== '') logger.log('metadata.ts file removed');
})();
