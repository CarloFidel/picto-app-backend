import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/auth.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  url!: string;

  @Column('text')
  word!: string;

  @ManyToOne(() => User, (User) => User.photo, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user!: User;
}
