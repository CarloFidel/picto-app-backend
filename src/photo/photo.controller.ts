import {
  BadRequestException,
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
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('photo')
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a photo file with the associated word',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        word: { type: 'string' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Photo uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request payload or no file uploaded' })
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required or invalid token' })
  @ApiResponse({ status: 413, description: 'File too large' })
  @ApiResponse({ status: 500, description: 'Internal server error while uploading photo' })
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
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

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

  @ApiResponse({ status: 200, description: 'Photos retrieved successfully for the authenticated user' })
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required or invalid token' })
  @ApiResponse({ status: 500, description: 'Internal server error while retrieving user photos' })
  @Get('all-from-user')
  @Auth()
  findAllfromUser(@GetUser() user: User) {
    return this.photoService.findAllfromUser(user);
  }

  @ApiResponse({ status: 200, description: 'Photo retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid photo id' })
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required or invalid token' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  @ApiResponse({ status: 500, description: 'Internal server error while retrieving photo' })
  @Get(':photoId')
  @Auth()
  findOne(@Param('photoId') photoId: string) {
    return this.photoService.findOne(photoId);
  }
}
