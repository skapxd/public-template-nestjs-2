import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DollarController } from './dollar.controller';
import { DollarService } from './dollar.service';
import { Dollar } from './entities/dollar.entity';
import { DollarSeeder } from './seeds/dollar.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Dollar])],
  controllers: [DollarController],
  providers: [DollarService, DollarSeeder],
})
export class DollarModule {}
