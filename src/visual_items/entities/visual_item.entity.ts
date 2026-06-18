import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ScheduleItem } from '../../schedule_items/entities/schedule_item.entity';

@Entity()
export class VisualItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', {
    nullable: false
  })
  url!: string;

  @Column()
  type!: string;

  @Column()
  word!: string;

  @OneToMany(() => ScheduleItem, (ScheduleItem) => ScheduleItem.id)
  sheduleItem!: ScheduleItem;
}
