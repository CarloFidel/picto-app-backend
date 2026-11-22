import { Controller, Get, Post, Body, Delete, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/auth.entity';
import { GoogleToken } from './dto/google-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { apiResponseExamples } from './utility/apiResponse.documentation';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({
    summary: 'Register a user',
    description: 'Creates a password-authenticated account. If the email belongs to an inactive account, the account is reactivated only when the supplied password matches.',
  })
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
  @ApiResponse({
    status: 400,
    description: 'Invalid registration data or validation failed',
    schema: { example: apiResponseExamples.validationErrorExample },
  })
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

  @ApiOperation({
    summary: 'Log in with email and password',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: { example: apiResponseExamples.loggedInUserExample },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid login payload or validation failed',
    schema: { example: apiResponseExamples.validationErrorExample },
  })
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

  @ApiOperation({
    summary: 'Authenticate with Google',
    description: 'Validates a Google ID token. The account is created, reused, or reactivated according to the verified Google email.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Google ID token validated. Creates the user, logs in an existing one, or recovers an inactive account for that Google email.',
    schema: {
      example: apiResponseExamples.googleLoggedInUserExample,
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 401, description: 'Google ID token is invalid or its email is not verified.' })
  @ApiResponse({ status: 500, description: 'Internal server error while validating the Google token.' })
  @Post('google')
  loginGoogle(@Body() googleToken: GoogleToken) {
    return this.authService.loginGoogle(googleToken);
  }

  @ApiOperation({
    summary: 'Update the authenticated user',
    description: 'Updates the optional name and lastName fields and returns a refreshed JWT.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Authenticated user profile updated successfully. A new JWT is returned.',
    schema: { example: apiResponseExamples.patchedUserExample },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body or validation failed',
    schema: { example: apiResponseExamples.validationErrorExample },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error while patching user' })
  @Patch('user')
  @Auth()
  patchUser(@Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
    return this.authService.patchUser(updateUserDto, user);
  }

  @ApiOperation({
    summary: 'Get the authenticated user',
    description: 'Returns the current JWT user and its related schedules.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully, including related schedules',
    schema: { example: apiResponseExamples.patchedUserExample },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized: authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error while retrieving user' })
  @Get('oneUser')
  @Auth()
  findOne(@GetUser() user: User) {
    return this.authService.findOne(user.id);
  }

  @ApiOperation({
    summary: 'Deactivate the authenticated user',
    description: 'Soft-deletes the account by setting isActive to false.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Authenticated user account deactivated (soft delete)',
    schema: {
      example: apiResponseExamples.deletedUserExample,
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
