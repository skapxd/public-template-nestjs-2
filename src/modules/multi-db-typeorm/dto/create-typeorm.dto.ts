import { IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTypeormDto {
  @ApiProperty({ default: 'label' })
  @IsString()
  label: string;

  @ApiProperty({ default: 'label' })
  @IsString()
  value: string;
}
