import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class UserFromExcelCollection {
  @Prop()
  dni: string;

  @Prop()
  fechaNacimiento: string;

  @Prop()
  nombre: string;
}

export type UserFromExcelDocument = HydratedDocument<UserFromExcelCollection>;

export const UserFromExcelSchema = SchemaFactory.createForClass(
  UserFromExcelCollection,
);
