import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventsEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: number;

  @Column({
    type: 'text',
  })
  traceUUID: string;

  @Column()
  timestamp: number;

  @Column({
    type: 'text',
  })
  nameEvent: string;

  @Column({
    type: 'text',
  })
  payload: string;
}
