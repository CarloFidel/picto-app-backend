import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities/auth.entity';

@Entity()
export class Photo {
  @ApiProperty({ description: 'Unique identifier for the photo', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Cloudinary URL of the uploaded photo', example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' })
  @Column('text')
  url!: string;

  @ApiProperty({ description: 'Word associated with the photo', example: 'apple' })
  @Column('text')
  word!: string;

  @ApiProperty({ type: () => User, description: 'User who uploaded the photo' })
  @ManyToOne(() => User, (User) => User.photo, {
    onDelete: 'CASCADE',
  })
  user!: User;
}
