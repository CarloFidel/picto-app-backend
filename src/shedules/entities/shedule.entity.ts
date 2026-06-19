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

@Entity()
export class Shedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  title!: string;

  @ManyToOne(() => User, (User) => User.shedule, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user!: User;

  @OneToMany(() => ScheduleItem, (scheduleItem) => scheduleItem.schedule, {
    cascade: true,

  })
  scheduleItems!: ScheduleItem[];

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
