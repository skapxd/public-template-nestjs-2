import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TypeormEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  value: string;
}
