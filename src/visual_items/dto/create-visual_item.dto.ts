import { IsEnum, IsString } from 'class-validator';
import { VisualItemTypes } from '../interfaces/visual-items.interface';

export class CreateVisualItemDto {
  @IsString()
  url!: string;

  @IsEnum(VisualItemTypes)
  type!: VisualItemTypes;

  @IsString()
  word!: string;
}
