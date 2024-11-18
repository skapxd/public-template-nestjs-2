import { Module } from '@nestjs/common';

import { DownloadFileController } from './download-file.controller';
import { DownloadFileService } from './download-file.service';

@Module({
  controllers: [DownloadFileController],
  providers: [DownloadFileService],
})
export class DownloadFileModule {}
