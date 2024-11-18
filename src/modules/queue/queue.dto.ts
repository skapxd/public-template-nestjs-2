import { IsString, MaxLength } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueueDTO {
  @ApiProperty({ default: 'audio.mp3' })
  @IsString()
  @MaxLength(255)
  readonly file: string;
}
