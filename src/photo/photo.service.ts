import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { User } from '../auth/entities/auth.entity';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class PhotoService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinaryClient: typeof cloudinary,
    @InjectRepository(Photo)
    private readonly photoRepostory: Repository<Photo>,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    user: User,
    createPhotoDto: CreatePhotoDto,
  ): Promise<UploadApiResponse> {
    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const stream = this.cloudinaryClient.uploader.upload_stream(
          { folder: 'mobil-photos' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as UploadApiResponse);
          },
        );
        stream.end(file.buffer);
      },
    );
    try {
      const exisiting = await this.findAllfromUser(user);

      if (exisiting.length >= 20) {
        throw new BadRequestException(
          'You have reached the maximum number of photos allowed',
        );
      }

      const photo = this.photoRepostory.create({
        ...createPhotoDto,
        url: uploadResult.secure_url ?? uploadResult.url,
        user,
      });

      await this.photoRepostory.save(photo);

      return uploadResult;
    } catch (error: any) {
      this.handleDBError(error);
    }
  }

  private async findAllfromUser(user: User) {
    const photos = await this.photoRepostory.find({
      where: { user: { id: user.id } },
    });
    console.log(photos);
    return photos;
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Please check servers logs');
  }
}
