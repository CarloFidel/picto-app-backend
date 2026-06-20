import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSheduleDto {
  @ApiProperty({
    description: 'Title of the schedule',
    example: 'morning routine',
    default: 'new schedule',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  title!: string;
}
