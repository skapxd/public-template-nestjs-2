import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { MongooseController } from './mongoose.controller';
import { MongooseService } from './mongoose.service';
import { connectionName } from './mongoose-connection-name';
import { MongooseCollection, MongooseSchema } from './schema/schema';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      connectionName: connectionName,
      useFactory: async () => {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        return {
          uri,
        };
      },
    }),
    MongooseModule.forFeature([
      { name: MongooseCollection.name, schema: MongooseSchema },
    ]),
  ],
  controllers: [MongooseController],
  providers: [MongooseService],
})
export class CustomMongooseModule {}
