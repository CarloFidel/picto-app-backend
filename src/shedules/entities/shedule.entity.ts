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
import { ScheduleItem } from '../../schedule_items/entities/schedule_item.entity';

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

  @OneToMany(() => ScheduleItem, (ScheduleItem) => ScheduleItem.id)
  sheduleItem!: ScheduleItem[];

  @BeforeInsert()
  checkTitleBeforeInsert() {
    this.title = this.title.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkTitleBeforeUpdate() {
    this.title = this.title.toLowerCase().trim();
  }
}
