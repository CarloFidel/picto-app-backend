import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Shedule } from '../../shedules/entities/shedule.entity';
import { IsArray } from 'class-validator';
import { Photo } from '../../photo/entities/photo.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  name!: string;

  @Column('text')
  lastName!: string;

  @Column('text', {
    unique: true,
  })
  email!: string;

  @Column('text')
  password!: string;

  @Column('bool', {
    default: true,
  })
  isActive!: boolean;

  @Column('text', {
    default: 'user',
  })
  @IsArray()
  roles?: string[];

  @OneToMany(() => Shedule, (Shedule) => Shedule.user )
  shedule!: Shedule[];

  @OneToMany(() => Photo, (Photo) => Photo.user )
  photo!: Photo[];

  @BeforeInsert()
  checkFiledsbeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkFiledsbeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
