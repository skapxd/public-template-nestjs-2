import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { getRedisConfig } from '#/src/utils/redis-connection.no-spec';
import { MATH_SERVICE } from '#/src/utils/token-names';

import { ServerMicroServiceController } from './server-micro-service.controller';
import { ServerMicroServiceService } from './server-micro-service.service';

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
  ],
  controllers: [ServerMicroServiceController],
  providers: [ServerMicroServiceService],
})
export class ServerMicroServiceModule {}
