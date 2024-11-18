import { PartialType } from '@nestjs/swagger';

import { CreateMongooseDto } from './create-mongoose.dto';

export class UpdateMongooseDto extends PartialType(CreateMongooseDto) {}
