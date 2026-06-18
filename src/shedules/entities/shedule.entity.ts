import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/auth.entity';

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

  @BeforeInsert()
  checkTitleBeforeInsert() {
    this.title = this.title.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkTitleBeforeUpdate() {
    this.title = this.title.toLowerCase().trim();
  }
}
