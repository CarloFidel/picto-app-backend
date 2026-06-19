import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateScheduleItemDto } from '../../schedule_item/dto/create-schedule_item.dto';
import { CreateSheduleDto } from './create-shedule.dto';

export class SaveAllDto extends CreateSheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleItemDto)
  items!: CreateScheduleItemDto[];
}
