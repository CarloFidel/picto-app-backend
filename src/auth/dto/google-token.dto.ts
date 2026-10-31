import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GoogleToken {
  @ApiProperty({ description: 'User token from google'})
  @IsString()
  token!: string;

}
