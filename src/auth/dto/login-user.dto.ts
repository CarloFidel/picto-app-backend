import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email address of an active user.',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsString()
  email!: string;

  @ApiProperty({
    description: 'Account password.',
    example: 'Password1',
    format: 'password',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,20}$/, {
    message:
      'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número',
  })
  password!: string;
}
