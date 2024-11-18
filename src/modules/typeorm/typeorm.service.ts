import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { CreateTypeormDto } from './dto/create-typeorm.dto';
import { UpdateTypeormDto } from './dto/update-typeorm.dto';
import { TypeormEntity } from './entities/typeorm.entity';

@Injectable()
export class TypeormService {
  constructor(
    @InjectRepository(TypeormEntity)
    private usersRepository: Repository<TypeormEntity>,
  ) {}

  async create(createTypeormDto: CreateTypeormDto) {
    await this.usersRepository.save(createTypeormDto);
    return;
  }

  async findAll() {
    const all = await this.usersRepository.find();
    return all;
  }

  async findOne(criteria: FindOneOptions<TypeormEntity>) {
    const one = await this.usersRepository.findOne(criteria);
    return one;
  }

  async update(id: number, updateTypeormDto: UpdateTypeormDto) {
    await this.usersRepository.update({ id }, updateTypeormDto);
    return;
  }

  async remove(id: number) {
    await this.usersRepository.delete({ id });
    return;
  }
}
