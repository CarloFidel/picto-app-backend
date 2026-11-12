import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/auth.entity';
import { GoogleToken } from './dto/google-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { apiResponseExamples } from './utility/apiResponse.documentation';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiResponse({
    status: 201,
    description:
      'User registered successfully. If the email belongs to an inactive account and the password matches, the account is recovered instead.',
    schema: {
      examples: {
        registered: { value: apiResponseExamples.registeredUserExample },
        recovered: { value: apiResponseExamples.recoveredUserExample },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  @ApiResponse({
    status: 401,
    description: 'Inactive account found but the password does not match, so it cannot be recovered',
  })
  @ApiResponse({ status: 409, description: 'Email already in use by an active account' })
  @ApiResponse({ status: 500, description: 'Internal server error while registering user' })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: { example: apiResponseExamples.loggedInUserExample },
  })
  @ApiResponse({ status: 400, description: 'Invalid login credentials' })
  @ApiResponse({ status: 401, description: 'Password is incorrect' })
  @ApiResponse({
    status: 404,
    description: 'No user found for that email, or the account is inactive',
  })
  @ApiResponse({ status: 500, description: 'Internal server error while logging in' })
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiResponse({
    status: 200,
    description:
      'Google ID token validated. Creates the user, logs in an existing one, or recovers an inactive account for that Google email.',
    schema: {
      example: {
        ...apiResponseExamples.loggedInUserExample,
        avatar: 'https://lh3.googleusercontent.com/a/example',
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

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Authenticated user profile updated successfully. Only name, lastName and avatar are applied. A new JWT is returned.',
    schema: { example: apiResponseExamples.patchedUserExample },
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error while patching user' })
  @Patch('user')
  @Auth()
  patchUser(@Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
    return this.authService.patchUser(updateUserDto, user);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully, including related schedules',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error while retrieving user' })
  @Get('oneUser')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Authenticated user account deactivated (soft delete)',
    schema: {
      example: {
        status: 200,
        message: 'Deleted succesfull',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error while deleting user' })
  @Delete('user')
  @Auth()
  remove(@GetUser() user: User) {
    return this.authService.remove(user);
  }
}
