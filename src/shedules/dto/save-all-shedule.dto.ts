import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateScheduleItemDto } from '../../schedule_item/dto/create-schedule_item.dto';
import { CreateSheduleDto } from './create-shedule.dto';

export class SaveAllDto extends CreateSheduleDto {
  @ApiProperty({
    description: 'Array of schedule items included in the schedule',
    type: () => CreateScheduleItemDto,
    isArray: true,
    example: [
      {
        position: 1,
        visualitem: {
          url: 'https://example.com/image.png',
          type: 'photo',
          word: 'apple',
        },
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleItemDto)
  items!: CreateScheduleItemDto[];
}
