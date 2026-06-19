import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Shedule } from '../../shedules/entities/shedule.entity';
import { ScheduleItem } from '../../schedule_item/entities/schedule_item.entity';

@Entity()
export class VisualItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', {
    nullable: false,
  })
  url!: string;

  @Column('text')
  type!: string;

  @Column()
  word!: string;

  @ManyToOne(() => Shedule, (Shedule) => Shedule.visualItem, {
    onDelete: 'CASCADE'
  })
  shedule!: Shedule;

  @OneToMany(() => ScheduleItem, (scheduleItem) => scheduleItem.visualItem)
  scheduleItems!: ScheduleItem[];
}
