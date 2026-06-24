import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Shedule } from '../../shedules/entities/shedule.entity';
import { ScheduleItem } from '../../schedule_item/entities/schedule_item.entity';

@Entity()
export class VisualItem {
  @ApiProperty({ description: 'Unique identifier for the visual item', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Image or icon URL for the visual item', example: 'https://example.com/image.png' })
  @Column('text', {
    nullable: false,
  })
  url!: string;

  @ApiProperty({ description: 'Type of visual item', example: 'IMAGE' })
  @Column('text')
  type!: string;

  @ApiProperty({ description: 'Associated word for the visual item', example: 'apple' })
  @Column()
  word!: string;

  @ApiProperty({ type: () => Shedule, description: 'Schedule associated to this visual item' })
  @ManyToOne(() => Shedule, (Shedule) => Shedule.visualItem, {
    eager: true,
    onDelete: 'CASCADE',
  })
  shedule!: Shedule;

  @ApiProperty({ type: () => ScheduleItem, isArray: true, description: 'Related schedule items for this visual item' })
  @OneToMany(() => ScheduleItem, (scheduleItem) => scheduleItem.visualItem)
  scheduleItems!: ScheduleItem[];
}
