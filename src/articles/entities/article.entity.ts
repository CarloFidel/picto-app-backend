import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/auth.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  title!: string;

  @Column('text')
  resume!: string;

  @Column('text')
  body!: string;

  @ManyToOne(() => User, (User) => User.article, {
    onDelete: 'CASCADE',
  })
  user!: User;
}
