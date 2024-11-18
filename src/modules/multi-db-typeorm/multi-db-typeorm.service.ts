import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions } from 'typeorm';

import { connectionName1, connectionName2 } from './const';
import { CreateTypeormDto } from './dto/create-typeorm.dto';
import { UpdateTypeormDto } from './dto/update-typeorm.dto';
import { TypeormEntity } from './entities/typeorm.entity';

@Injectable()
export class MultiDbTypeormService {
  constructor(
    @InjectEntityManager(connectionName1)
    private entityManager1: EntityManager,

    @InjectEntityManager(connectionName2)
    private entityManager2: EntityManager,
  ) {}

  async create(createTypeormDto: CreateTypeormDto) {
    await this.entityManager1.save(TypeormEntity, createTypeormDto);
    return;
  }

  async findAll() {
    const all = await this.entityManager1.find(TypeormEntity);
    return all;
  }

  async findOne(criteria: FindOneOptions<TypeormEntity>) {
    const one = await this.entityManager1.findOne(TypeormEntity, criteria);
    return one;
  }

  async update(id: number, updateTypeormDto: UpdateTypeormDto) {
    await this.entityManager1.update(TypeormEntity, { id }, updateTypeormDto);
    return;
  }

  async remove(id: number) {
    await this.entityManager1.delete(TypeormEntity, { id });
    return;
  }
}
