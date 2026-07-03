import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/auth.entity';

@Entity()
export class Calendar {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', { nullable: false })
  date!: string;

  @Column('simple-array', { nullable: false })
  sheduleId!: string[];

  @ManyToOne(() => User, (User) => User.events)
  user!: User;
}
