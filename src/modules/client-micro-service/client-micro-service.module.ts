import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { getRedisConfig } from '#/src/utils/redis-connection.no-spec';
import { MATH_SERVICE } from '#/src/utils/token-names';

import { ClientMicroServiceController } from './client-micro-service.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MATH_SERVICE,
        async useFactory() {
          const redisOptions = await getRedisConfig();
          return {
            transport: Transport.REDIS,
            options: redisOptions,
          };
        },
      },
    ]),
    EventEmitterModule.forRoot({
      delimiter: '.',
      wildcard: true,
      global: true,
      verboseMemoryLeak: true,
    }),
  ],
  controllers: [ClientMicroServiceController],
})
export class ClientMicroServiceModule {}
