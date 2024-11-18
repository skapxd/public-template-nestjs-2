import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { validateDTO } from '#/src/utils/validate-dto';

import { CreateDollarDto } from './dto/create-dollar.dto';
import { UpdateDollarDto } from './dto/update-dollar.dto';
import { Dollar } from './entities/dollar.entity';

@Injectable()
export class DollarService {
  private readonly logger = new Logger(DollarService.name);

  constructor(
    @InjectRepository(Dollar)
    private readonly repository: Repository<Dollar>,
  ) {}

  async create(dto: CreateDollarDto): Promise<Dollar> {
    await validateDTO(dto, CreateDollarDto);

    try {
      const identification = await this.repository.create(dto);
      return await this.repository.save(identification);
    } catch (error) {
      this.logger.error('Error creating dollar', error as Error);
      throw new BadRequestException('Error creating dollar');
    }
  }

  async findAll(): Promise<Dollar[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      this.logger.error('Failed to get dollars', error as Error);
      throw new InternalServerErrorException('Failed to get dollars');
    }
  }

  async findOne(id: string): Promise<Dollar> {
    try {
      const dollar = await this.repository.findOne({ where: { id } });

      if (!dollar) {
        this.logger.error(`Dollar with id ${id} not found`);
        throw new NotFoundException(`Dollar with id ${id} not found`);
      }

      return dollar;
    } catch (error) {
      this.logger.error(`Failed to get Dollar with id ${id}`, error as Error);
      throw new NotFoundException(`Dollar with id ${id} not found`);
    }
  }

  async update(id: string, dto: UpdateDollarDto): Promise<Dollar> {
    await validateDTO(dto, UpdateDollarDto);

    const dollar = await this.repository.findOne({ where: { id } });

    if (!dollar) {
      this.logger.error(`Dollar with id ${id} not found`);
      throw new NotFoundException(`Dollar with id ${id} not found`);
    }

    try {
      await this.repository.update(id, dto);
      const dollar = await this.repository.findOne({ where: { id } });

      if (!dollar) {
        this.logger.error(`Dollar with id ${id} not found`);
        throw new NotFoundException(`Dollar with id ${id} not found`);
      }

      return dollar;
    } catch (error) {
      this.logger.error(
        `Failed to update Dollar with id ${id}`,
        error as Error,
      );
      throw new InternalServerErrorException(
        `Failed to update Dollar with id ${id}`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    const dollar = await this.repository.findOne({ where: { id } });

    if (!dollar) {
      this.logger.error(`Dollar with id ${id} not found`);
      throw new NotFoundException(`Dollar with id ${id} not found`);
    }

    try {
      await this.repository.delete(id);
    } catch (error) {
      this.logger.error(
        `Failed to delete Dollar with id ${id}`,
        error as Error,
      );
      throw new InternalServerErrorException(
        `Failed to delete Dollar with id ${id}`,
      );
    }
  }
}
