import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { RegisterUserDto } from './dtos/register-user.dto';
import { AuthService } from './auth.service';
import { ICheckUserResponse } from './interface/check-user-response.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/check-user-exists')
  async checkUserExists(
    @Query('gitHubUsername') gitHubUsername: string,
  ): Promise<ICheckUserResponse> {
    return await this.authService.checkUserExists(gitHubUsername);
  }

  @Post('/sign-up')
  handleSignUp(@Body() data: RegisterUserDto): Promise<User> {
    return this.authService.handleSignUp(data);
  }
}
