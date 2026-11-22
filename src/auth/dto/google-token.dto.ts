import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class GoogleToken {
  @ApiProperty({
    description: 'Google ID token obtained by the client after Google Sign-In.',
    example: 'eyJhbGciOiJSUzI1NiIs...',
  })
  @IsString()
  token!: string;

  @ApiProperty({
    description: 'Roles assigned when a new Google account is created. Defaults to no explicit role.',
    example: ['user'],
    isArray: true,
    enum: ['user', 'therapist'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
