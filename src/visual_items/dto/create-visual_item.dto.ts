import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VisualItemTypes } from '../interfaces/visual-items.interface';

export class CreateVisualItemDto {
  @ApiProperty({ description: 'Image or icon URL for the visual item', example: 'https://example.com/image.png' })
  @IsString()
  url!: string;

  @ApiProperty({ description: 'Type of visual item', enum: VisualItemTypes, example: VisualItemTypes.photo })
  @IsEnum(VisualItemTypes)
  type!: VisualItemTypes;

  @ApiProperty({ description: 'Associated word for the visual item', example: 'apple' })
  @IsString()
  word!: string;
}
