import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsObject, ValidateNested } from 'class-validator';
import { CreateVisualItemDto } from '../../visual_items/dto/create-visual_item.dto';

export class CreateScheduleItemDto {
  @ApiProperty({
    description: 'Position of the item within the schedule',
    example: 1,
    default: 1,
  })
  @IsNumber()
  position!: number;

  @ApiProperty({
    type: () => CreateVisualItemDto,
    description: 'Visual item associated with this schedule item',
    example: {
      url: 'https://example.com/image.png',
      type: 'photo',
      word: 'apple',
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateVisualItemDto)
  visualitem!: CreateVisualItemDto;
}
