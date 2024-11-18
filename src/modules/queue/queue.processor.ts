import { createReadStream } from 'node:fs';

import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { BadGatewayException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, Queue } from 'bull';
import { Model } from 'mongoose';
import readXlsxFile from 'read-excel-file/node';

import { QUEUE_AUDIO } from './const';
import { QueueDTO } from './queue.dto';
import { UserFromExcelCollection, UserFromExcelDocument } from './queue.schema';

@Processor(QUEUE_AUDIO.name)
export class AudioProcessor {
  private readonly logger = new Logger(AudioProcessor.name);
  constructor(
    @InjectQueue(QUEUE_AUDIO.name) private readonly queue: Queue,
    @InjectModel(UserFromExcelCollection.name)
    private readonly model: Model<UserFromExcelDocument>,
  ) {}

  @Process(QUEUE_AUDIO.processAudio)
  private async process(job: Job<QueueDTO>) {
    this.logger.debug('Start transcoding...');
    let progress = 0;
    const limit = 100_000;
    for (let i = 0; i < limit; i++) {
      progress = (i / limit) * 100;
      const _ = +progress.toFixed(2);
      this.logger.log({ _, progress });
      await job.progress(_);
    }
    this.logger.debug('Transcoding completed');
  }

  add(dto: QueueDTO) {
    this.queue.add(QUEUE_AUDIO.processAudio, dto);
  }

  async processXlsx(file: Express.Multer.File) {
    await this.queue.add(QUEUE_AUDIO.processXlsx, file);
  }

  @Process(QUEUE_AUDIO.processXlsx)
  private async xlsx(job: Job<Express.Multer.File>) {
    const readStream = createReadStream(job.data.path);
    const rows = (await readXlsxFile(readStream)) as Array<
      [string, string, string, string]
    >;

    const cuotaAsegurado = rows[7][1];

    if (!cuotaAsegurado) {
      throw new BadGatewayException({
        status: 'error',
        message: 'El excel no incluye la cuota por cada asegurado',
      });
    }

    let progress = 0;
    const limit = rows.length;
    for (let index = 0; index < limit; index++) {
      const row = rows[index];

      await this.model.findOneAndUpdate(
        {
          dni: row[1],
        },
        {
          nombre: row[0],
          dni: row[1],
          fechaNacimiento: row[3],
        },
        { upsert: true, returnDocument: 'after', new: true, sort: { _id: -1 } },
      );

      progress = (index / limit) * 100;
      const _ = +progress.toFixed(2);
      this.logger.log({ _, progress, index });
      await job.progress(_);
    }
  }
}
