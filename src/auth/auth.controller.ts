import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/auth.entity';
import { GoogleToken } from './dto/google-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  @ApiResponse({ status: 500, description: 'Internal server error while registering user' })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Invalid login credentials' })
  @ApiResponse({ status: 401, description: 'Unauthorized: invalid email or password' })
  @ApiResponse({ status: 500, description: 'Internal server error while logging in' })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Google ID token validated successfully.',
    schema: {
      example: {
        email: 'john.doe@example.com',
        name: 'John',
        lastName: 'Doe',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Google ID token is invalid or its email is not verified.' })
  @ApiResponse({ status: 500, description: 'Internal server error while validating the Google token.' })
  @Post('google')
  loginGoogle(@Body() googleToken: GoogleToken) {
    return this.authService.loginGoogle(googleToken);
  }

  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid user id' })
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error while retrieving user' })
  @Get('oneUser')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error while deleting user' })
  @Delete('user')
  @Auth()
  remove(@GetUser() user: User) {
    return this.authService.remove(user);
  }
}
