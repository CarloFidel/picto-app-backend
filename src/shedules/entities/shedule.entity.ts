import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/auth.entity';
import { VisualItem } from '../../visual_items/entities/visual_item.entity';
import { ScheduleItem } from '../../schedule_item/entities/schedule_item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Shedule {
  @ApiProperty({
    description: 'Unique identifier for the schedule',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    default: '00000000-0000-0000-0000-000000000000',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    description: 'Title of the schedule',
    example: 'morning routine',
    default: 'new schedule',
  })
  @Column('text')
  title!: string;

  @ApiProperty({
    type: () => User,
    description: 'User who owns this schedule',
    example: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
    },
    default: null,
  })
  @ManyToOne(() => User, (User) => User.shedule, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user!: User;

  @ApiProperty({
    type: () => ScheduleItem,
    isArray: true,
    description: 'List of schedule items within this schedule',
    example: [],
    default: [],
  })
  @OneToMany(() => ScheduleItem, (scheduleItem) => scheduleItem.schedule, {
    cascade: true,
  })
  scheduleItems!: ScheduleItem[];

  @ApiProperty({
    type: () => VisualItem,
    isArray: true,
    description: 'Visual items attached to this schedule',
    example: [],
    default: [],
  })
  @OneToMany(() => VisualItem, (VisualItem) => VisualItem.shedule)
  visualItem!: VisualItem[];

  @BeforeInsert()
  checkTitleBeforeInsert() {
    this.title = this.title.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkTitleBeforeUpdate() {
    this.title = this.title.toLowerCase().trim();
  }
}
