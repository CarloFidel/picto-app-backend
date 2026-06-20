import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePhotoDto {
    @ApiProperty({ description: 'Word associated with the uploaded photo', example: 'apple' })
    @IsString()
    word!: string;
}
