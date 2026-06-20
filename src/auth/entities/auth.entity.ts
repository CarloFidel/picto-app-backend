import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Shedule } from '../../shedules/entities/shedule.entity';
import { IsArray } from 'class-validator';
import { Photo } from '../../photo/entities/photo.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Unique identifier for the user', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @Column('text')
  name!: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @Column('text')
  lastName!: string;

  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
  @Column('text', {
    unique: true,
  })
  email!: string;

  @ApiProperty({ description: 'Hashed password for the user account', example: 'Password1' })
  @Column('text')
  password!: string;

  @ApiProperty({ description: 'Whether the user account is active', example: true })
  @Column('bool', {
    default: true,
  })
  isActive!: boolean;

  @ApiProperty({ description: 'Roles assigned to the user', example: ['user'] })
  @Column('text', {
    default: 'user',
  })
  @IsArray()
  roles?: string[];

  @ApiProperty({ type: () => Shedule, isArray: true, description: 'Schedules created by the user' })
  @OneToMany(() => Shedule, (Shedule) => Shedule.user)
  shedule!: Shedule[];

  @ApiProperty({ type: () => Photo, isArray: true, description: 'Photos uploaded by the user' })
  @OneToMany(() => Photo, (Photo) => Photo.user)
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
