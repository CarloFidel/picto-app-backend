import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Shedule } from '../../shedules/entities/shedule.entity';
import { VisualItem } from '../../visual_items/entities/visual_item.entity';

@Entity('schedule_items')
export class ScheduleItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  position!: number;

  @ManyToOne(() => Shedule, (schedule) => schedule.scheduleItems, {
    eager: true,

    onDelete: 'CASCADE',
  })
  schedule!: Shedule;

  @ManyToOne(() => VisualItem, (visualItem) => visualItem.scheduleItems, {
    eager: true,
  })
  visualItem!: VisualItem;
}
