import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Dollar } from '../entities/dollar.entity';

@Injectable()
export class DollarSeeder implements OnModuleInit {
  private readonly logger = new Logger(DollarSeeder.name);

  constructor(
    @InjectRepository(Dollar)
    private readonly dollarRepository: Repository<Dollar>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    try {
      const count = await this.dollarRepository.count();

      if (count > 0) {
        this.logger.log('Dollar table already seeded');
        return;
      }

      const defaultDollars = [
        {
          value: 250,
        },
      ];

      await this.dollarRepository.save(defaultDollars);
      this.logger.log('Dollar table seeded');
    } catch (error) {
      this.logger.error('Error seeding dollar table');
    }
  }
}
