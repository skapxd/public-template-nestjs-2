import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ClientMicroServiceModule } from '../client-micro-service/client-micro-service.module';
import { DownloadFileModule } from '../download-file/download-file.module';
import { CustomMongooseModule } from '../mongoose/mongoose.module';
import { MultiDbTypeormModule } from '../multi-db-typeorm/multi-db-typeorm.module';
import { AudioModule } from '../queue/queue.module';
import { SaveAllEventModule } from '../save-all-events/save-all-event.module';
import { ServerMicroServiceModule } from '../server-micro-service/server-micro-service.module';
import { SseModule } from '../sse/sse.module';
import { TypeormModule } from '../typeorm/typeorm.module';
import { WorkerModule } from '../worker/worker.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    SaveAllEventModule,
    ServeStaticModule.forRoot({ rootPath: join(process.cwd(), 'public') }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      wildcard: true,
      global: true,
      verboseMemoryLeak: true,
    }),
    SseModule,
    WorkerModule,
    AudioModule,
    CustomMongooseModule,
    TypeormModule,
    MultiDbTypeormModule,
    DownloadFileModule,
    ClientMicroServiceModule,
    ServerMicroServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
