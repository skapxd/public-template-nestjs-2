import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: true }, strict: false })
export class MongooseCollection {
  @Prop()
  label: string;

  @Prop()
  value: string;
}

export type MongooseDocument = HydratedDocument<MongooseCollection>;

export const MongooseSchema = SchemaFactory.createForClass(MongooseCollection);
