import 'source-map-support/register';
import 'dotenv/config';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './modules/app/app.module';
import { mainConfig } from './utils/main-config.no-spec';
import { getRedisConfig } from './utils/redis-connection.no-spec';

async function bootstrap(CPUs: number) {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    // logger: ['error', 'warn'],
  });
  const logger = new Logger(bootstrap.name);
  const redisOptions = await getRedisConfig();
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: redisOptions,
  });
  await app.startAllMicroservices();

  logger.error(`CPUs: ${CPUs}`);
  mainConfig(app);

  await app.listen(process.env.PORT || 3000);

  const url = await app.getUrl();

  logger.log(`Server is running in ${url} with ${CPUs} CPUs`);
}

bootstrap(1);
