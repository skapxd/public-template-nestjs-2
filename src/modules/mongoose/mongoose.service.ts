import { createWriteStream } from 'node:fs';
import { join } from 'node:path';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { EJSON } from 'bson';
import { Duration } from 'luxon';
import { Connection, Model } from 'mongoose';

import { CreateMongooseDto } from './dto/create-mongoose.dto';
import { UpdateMongooseDto } from './dto/update-mongoose.dto';
import { MongooseCollection, MongooseDocument } from './schema/schema';

@Injectable()
export class MongooseService implements OnModuleInit {
  private readonly logger = new Logger(MongooseService.name);

  constructor(
    @InjectModel(MongooseCollection.name)
    private readonly model: Model<MongooseDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async onModuleInit() {
    const countData = await this.model.countDocuments();
    if (countData > 0) return;

    await this.model.create([
      { label: 'label 1', value: 'value 1' },
      { label: 'label 2', value: 'value 2' },
      { label: 'label 3', value: 'value 3' },
    ]);
  }

  async create(createMongooseDto: CreateMongooseDto) {
    await this.model.create(createMongooseDto);
  }

  async findAll() {
    return await this.model.find();
  }

  async update(id: string, updateMongooseDto: UpdateMongooseDto) {
    await this.model.updateOne({ _id: id }, { $set: updateMongooseDto });
  }

  async remove(id: string) {
    await this.model.deleteOne({ _id: id });
  }

  async backUp() {
    try {
      const collections = await this.connection.listCollections();

      const humanFormat = "h 'h' m 'min' s 'sec' S 'mili sec'";
      let totalTime = 0;

      let nameMoreLong = '';
      collections.forEach((e) => {
        if (e.name.length > nameMoreLong.length) {
          nameMoreLong = e.name;
        }
      });

      const fedBackObj: Record<
        string,
        {
          total: number;
          current: number;
          progress: string;
          time: string;
          completeWriteFile: boolean;
        }
      > = {};

      collections.forEach((e) => {
        fedBackObj[e.name.padEnd(nameMoreLong.length, ' ')] = {
          total: 0,
          current: 0,
          progress: '0%',
          time: '0',
          completeWriteFile: false,
        };
      });

      for await (const collection of collections) {
        const startPerformance = performance.now();

        const fedBack =
          fedBackObj[collection.name.padEnd(nameMoreLong.length, ' ')];

        fedBack.total = await this.connection
          .collection(collection.name)
          .countDocuments();

        const path = (() => {
          // @ts-expect-error: ERR
          const url = import.meta.url;
          const __dirname = new URL('.', url).pathname;
          const path = join(__dirname, 'data', collection.name + '.json');

          return path;
        })();

        const writeStream = createWriteStream(path);

        writeStream.write('[\n');

        const asyncIterableCollection = this.connection
          .collection(collection.name)
          .find()
          .stream();

        for await (const document of asyncIterableCollection) {
          fedBack.current++;
          const isEndStream = fedBack.current === fedBack.total;

          const tempProgress = ((fedBack.current / fedBack.total) * 100)
            .toFixed(3)
            .padStart(6, ' ');

          fedBack.progress = tempProgress + '%';

          writeStream.write(EJSON.stringify(document));
          if (isEndStream) {
            writeStream.write('\n');
          } else {
            writeStream.write(',\n');
          }
        }

        writeStream.end(']\n', () => {
          fedBack.completeWriteFile = true;
        });

        const endPerformance = performance.now();
        fedBack.time = Duration.fromMillis(endPerformance - startPerformance)
          .toFormat(humanFormat)
          .padStart(30, ' ');

        totalTime += endPerformance - startPerformance;
      }

      const awaitForWriteAllFiles = async () => {
        return new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            const allComplete = Object.values(fedBackObj).every(
              (e) => e.completeWriteFile,
            );

            if (allComplete) {
              clearInterval(interval);
              resolve();
            }
          }, 300);
        });
      };

      await awaitForWriteAllFiles();
    } catch (error) {
      this.logger.log(error);
    }
  }
}
