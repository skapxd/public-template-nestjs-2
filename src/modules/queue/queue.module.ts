import { join } from 'node:path';

import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import RedisMemoryServer from 'redis-memory-server';

import { QUEUE_AUDIO } from './const';
import { AudioController } from './queue.controller';
import { AudioProcessor } from './queue.processor';
import { UserFromExcelCollection, UserFromExcelSchema } from './queue.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        return {
          uri,
        };
      },
    }),
    MongooseModule.forFeature([
      { name: UserFromExcelCollection.name, schema: UserFromExcelSchema },
    ]),
    MulterModule.register({
      dest: join(__dirname, 'temp'),
    }),
    BullModule.forRootAsync({
      useFactory: async () => {
        const redisServer = new RedisMemoryServer();

        const host = await redisServer.getHost();
        const port = await redisServer.getPort();

        return {
          redis: { host, port },
          defaultJobOptions: {
            attempts: 5,
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: QUEUE_AUDIO.name,
    }),
    BullBoardModule.forFeature({
      name: QUEUE_AUDIO.name,
      adapter: BullAdapter,
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
  ],
  controllers: [AudioController],
  providers: [AudioProcessor],
})
export class AudioModule {}
