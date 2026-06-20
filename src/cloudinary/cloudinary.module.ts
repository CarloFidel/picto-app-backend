import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryProvider } from './provider/cloudinary.provider';

@Module({
  controllers: [],
  providers: [CloudinaryProvider],
  imports: [ConfigModule],
  exports: [CloudinaryProvider],
})
export class CloudinaryModule {}
