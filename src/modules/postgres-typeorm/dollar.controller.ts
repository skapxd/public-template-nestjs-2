import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { DollarService } from './dollar.service';
import { CreateDollarDto } from './dto/create-dollar.dto';
import { UpdateDollarDto } from './dto/update-dollar.dto';

@Controller('dollar')
export class DollarController {
  constructor(private readonly dollarService: DollarService) {}

  @MessagePattern({ cmd: 'create_dollar' })
  async create(@Payload() createDollarDto: CreateDollarDto) {
    return await this.dollarService.create(createDollarDto);
  }

  @MessagePattern({ cmd: 'find_all_dollars' })
  async findAll() {
    return await this.dollarService.findAll();
  }

  @MessagePattern({ cmd: 'find_one_dollar' })
  async findOne(@Payload('id') id: string) {
    return await this.dollarService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_dollar' })
  async update(@Payload() dto: UpdateDollarDto) {
    return await this.dollarService.update(dto.id, dto);
  }

  @MessagePattern({ cmd: 'delete_dollar' })
  async remove(@Payload('id') id: string) {
    return await this.dollarService.remove(id);
  }
}
