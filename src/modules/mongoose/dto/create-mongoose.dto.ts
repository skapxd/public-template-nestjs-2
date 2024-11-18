import { IsString } from '@nestjs/class-validator';

export class CreateMongooseDto {
  @IsString()
  label: string;

  @IsString()
  value: string;
}
