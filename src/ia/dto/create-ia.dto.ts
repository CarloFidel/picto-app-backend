import { IsString, MinLength } from 'class-validator';

export class GenerateWordsDto {
  @IsString()
  @MinLength(3)
  action!: string;
}
