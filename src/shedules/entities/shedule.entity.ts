import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/auth.entity';

@Entity()
export class Shedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  @MinLength(2)
  @MaxLength(50)
  title!: string;

  @ManyToOne(() => User, (User) => User.shedule)
  user!: string;
}
