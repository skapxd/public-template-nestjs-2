import { rm, writeFile } from 'node:fs/promises';

import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const openApi = async (app: INestApplication) => {
  const logger = new Logger(openApi.name);
  if (process.env.NODE_ENV === 'development')
    await rm('public/swagger.json').catch((e) => logger.log(e));

  const config = new DocumentBuilder()
    .setTitle('NestJS example')
    .setDescription('The NestJS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV === 'development')
    await writeFile('public/swagger.json', JSON.stringify(document, null, 2));

  // const { SwaggerTheme } = require('swagger-themes');
  // const theme = new SwaggerTheme();
  // const customCss = theme.getBuffer('dark');
  // SwaggerModule.setup('api', app, document, {
  //   customCss,
  //   explorer: true,
  // });
};
