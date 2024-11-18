import { PartialType } from '@nestjs/mapped-types';
import { CreateDollarDto } from './create-dollar.dto';
import { IsUUID } from '@nestjs/class-validator';

export class UpdateDollarDto extends PartialType(CreateDollarDto) {
  @IsUUID()
  id: string;
}
