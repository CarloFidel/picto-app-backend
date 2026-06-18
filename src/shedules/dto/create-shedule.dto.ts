import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSheduleDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  title!: string;
}
