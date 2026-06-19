import { Type } from 'class-transformer';
import { IsNumber, IsObject, ValidateNested } from 'class-validator';
import { CreateVisualItemDto } from '../../visual_items/dto/create-visual_item.dto';

export class CreateScheduleItemDto {
  @IsNumber()
  position!: number;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateVisualItemDto)
  visualitem!: CreateVisualItemDto;
}
