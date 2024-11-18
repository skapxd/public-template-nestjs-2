import { Readable } from 'node:stream';

import {
  ParseFilePipeBuilder,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class FileDTO implements Express.Multer.File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: Readable;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  static fileName = 'file';

  static validation = new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: 'text/html',
    })
    .addMaxSizeValidator({
      maxSize: 1000,
    })
    .build({
      exceptionFactory: (error) => {
        throw new UnprocessableEntityException(error);
      },
    });
}
