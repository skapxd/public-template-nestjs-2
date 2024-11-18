import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateMongooseDto } from './dto/create-mongoose.dto';
import { UpdateMongooseDto } from './dto/update-mongoose.dto';
import { MongooseService } from './mongoose.service';

@Controller('mongoose')
export class MongooseController {
  constructor(private readonly mongooseService: MongooseService) {}

  @Post()
  create(@Body() createMongooseDto: CreateMongooseDto) {
    return this.mongooseService.create(createMongooseDto);
  }

  @Get()
  findAll() {
    return this.mongooseService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMongooseDto: UpdateMongooseDto,
  ) {
    return this.mongooseService.update(id, updateMongooseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mongooseService.remove(id);
  }

  // @Cron('45 * * * * *')
  backUp() {
    return this.mongooseService.backUp();
  }
}
