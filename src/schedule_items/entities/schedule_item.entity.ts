import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Shedule } from '../../shedules/entities/shedule.entity';
import { VisualItem } from '../../visual_items/entities/visual_item.entity';

@Entity()
export class ScheduleItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('integer')
  position!: number;

  @ManyToOne(() => Shedule, (Shedule) => Shedule.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  schedule!: string;

  @ManyToOne(() => VisualItem, (VisualItem) => VisualItem.id, {
    eager: true,
    onDelete: 'CASCADE'
  })
  visual_item!: VisualItem;
}
