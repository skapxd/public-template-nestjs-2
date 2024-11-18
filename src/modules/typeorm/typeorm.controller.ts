import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateTypeormDto } from './dto/create-typeorm.dto';
import { UpdateTypeormDto } from './dto/update-typeorm.dto';
import { TypeormService } from './typeorm.service';

@Controller('typeorm')
export class TypeormController {
  constructor(private readonly typeormService: TypeormService) {}

  @Post()
  async create(@Body() createTypeormDto: CreateTypeormDto) {
    await this.typeormService.create(createTypeormDto);
    return;
  }

  @Get()
  async findAll() {
    return await this.typeormService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeormDto: UpdateTypeormDto) {
    return this.typeormService.update(+id, updateTypeormDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeormService.remove(+id);
  }
}
