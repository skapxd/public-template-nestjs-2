import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Injectable } from '@nestjs/common';
import { lookup } from 'mime-types';

@Injectable()
export class DownloadFileService {
  async readFile() {
    const fileName = 'pdf-test.pdf';
    const pathFile = join(__dirname, fileName);

    return {
      buffer: await readFile(pathFile),
      type: lookup(fileName) || 'application/octet-stream',
    };
  }
}
