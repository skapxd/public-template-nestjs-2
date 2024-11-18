import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { connectionName1, connectionName2, database } from './const';
import { TypeormEntity } from './entities/typeorm.entity';
import { MultiDbTypeormController } from './multi-db-typeorm.controller';
import { MultiDbTypeormService } from './multi-db-typeorm.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: connectionName1,
      type: 'better-sqlite3',
      database,
      synchronize: true,
      dropSchema: true,
      entities: [TypeormEntity],
    }),
    TypeOrmModule.forFeature([TypeormEntity], connectionName1),

    TypeOrmModule.forRoot({
      name: connectionName2,
      type: 'better-sqlite3',
      database: database,
      synchronize: true,
      dropSchema: true,
      entities: [TypeormEntity],
    }),
    TypeOrmModule.forFeature([TypeormEntity], connectionName2),
  ],
  controllers: [MultiDbTypeormController],
  providers: [MultiDbTypeormService],
})
export class MultiDbTypeormModule {}
