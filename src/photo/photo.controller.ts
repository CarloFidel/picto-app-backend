import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadApiResponse } from 'cloudinary';
import { fileFilter } from './helper/fileFilte';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/auth.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload')
  @Auth()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async upLoadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
    @Body() createPhotoDto: CreatePhotoDto,
  ) {
    const uploadResult: UploadApiResponse = await this.photoService.uploadImage(
      file,
      user,
      createPhotoDto,
    );

    return {
      url: uploadResult.secure_url,
      message: 'Picture loaded correctly',
    };
  }
}
