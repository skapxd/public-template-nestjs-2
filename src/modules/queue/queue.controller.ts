import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

import { FileDTO } from './dto/file.dto';
import { QueueDTO } from './queue.dto';
import { AudioProcessor } from './queue.processor';

@Controller('audio')
export class AudioController {
  constructor(private readonly audioProcessor: AudioProcessor) {}

  @Post('transcode')
  async transcode(@Body() body: QueueDTO) {
    this.audioProcessor.add(body);
  }

  @Post('upload-single-file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileDTO })
  @UseInterceptors(FileInterceptor(FileDTO.fileName))
  async xlsx(@UploadedFile() file: FileDTO) {
    await this.audioProcessor.processXlsx(file);
    return;
  }
}
