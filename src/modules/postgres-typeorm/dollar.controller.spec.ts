import { isDate, isNumber, isUUID } from '@nestjs/class-validator';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { setupDataSource } from '#/src/utils/data-source-for-test.no-spec';
import { duration } from '#/src/utils/duration';
import { mainConfig } from '#/src/utils/main-config.no-spec';

import { DollarController } from './dollar.controller';
import { DollarService } from './dollar.service';
import { Dollar } from './entities/dollar.entity';
import { DollarSeeder } from './seeds/dollar.seeder';

describe('dollar.controller', () => {
  let app: INestApplication;
  let controller: DollarController;

  beforeAll(
    async () => {
      const dataSource = await setupDataSource([Dollar]);

      const moduleRef = await Test.createTestingModule({
        imports: [
          TypeOrmModule.forFeature([Dollar]),
          TypeOrmModule.forRoot({
            name: 'default',
            synchronize: true,
          }),
        ],
        controllers: [DollarController],
        providers: [DollarService, DollarSeeder],
      })
        .overrideProvider(DataSource)
        .useValue(dataSource)
        .compile();

      controller = moduleRef.get<DollarController>(DollarController);
      app = moduleRef.createNestApplication();

      await mainConfig(app);
      await app.init();
    },
    duration({ seconds: 30 }),
  );

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('CRUD', async () => {
    const allDollar = await (async () => {
      const dollar = await controller.findAll();

      expect(dollar.length).toEqual(1);
      return dollar;
    })();

    const dollarByID = await (async () => {
      const dollar = await controller.findOne(allDollar[0].id);

      expect(dollar.value).toEqual(250);
      return dollar;
    })();

    const updatedDollar = await (async () => {
      await controller.update({ id: dollarByID.id, value: 300 });

      const dollar = await controller.findOne(dollarByID.id);

      expect(dollar.value).toEqual(300);
      return dollar;
    })();

    const deletedDollar = await (async () => {
      await controller.remove(updatedDollar.id);

      await expect(() => controller.findOne(updatedDollar.id)).rejects.toThrow(
        NotFoundException,
      );
    })();

    const createdDollar = await (async () => {
      const dollar = await controller.create({ value: 250 });

      expect(dollar).toMatchObject({
        value: expect.toValidate(isNumber),
        id: expect.toValidate(isUUID),
        createdAt: expect.toValidate(isDate),
        updatedAt: expect.toValidate(isDate),
      });
      return dollar;
    })();
  });
});
