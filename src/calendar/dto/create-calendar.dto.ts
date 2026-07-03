import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCalendarDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  date!: string;

  @IsArray()
  @IsString({ each: true })
  sheduleId!: string[];
}
