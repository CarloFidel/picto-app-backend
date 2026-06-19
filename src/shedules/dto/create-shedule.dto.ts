import { Type } from 'class-transformer';
import { IsArray, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

export class CreateSheduleDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  title!: string;

}
