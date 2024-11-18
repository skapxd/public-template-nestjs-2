import { IsString } from '@nestjs/class-validator';

export class CreateTypeormDto {
  @IsString()
  label: string;

  @IsString()
  value: string;
}
