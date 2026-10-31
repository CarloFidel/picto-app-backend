import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GoogleToken {
  @ApiProperty({
    description: 'Google ID token obtained by the client after Google Sign-In.',
    example: 'eyJhbGciOiJSUzI1NiIs...',
  })
  @IsString()
  token!: string;
}
