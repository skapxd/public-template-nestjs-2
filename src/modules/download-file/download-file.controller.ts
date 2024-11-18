import { Controller, Get, StreamableFile } from '@nestjs/common';

import { DownloadFileService } from './download-file.service';

@Controller('download-file')
export class DownloadFileController {
  constructor(private readonly downloadFileService: DownloadFileService) {}

  @Get()
  async download() {
    const { buffer, type } = await this.downloadFileService.readFile();

    return new StreamableFile(buffer, {
      type,
    });
  }
}
