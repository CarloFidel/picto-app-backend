import { Module } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { PhotoController } from './photo.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PhotoController],
  providers: [PhotoService],
  imports: [CloudinaryModule, TypeOrmModule.forFeature([Photo]), AuthModule],
})
export class PhotoModule {}
