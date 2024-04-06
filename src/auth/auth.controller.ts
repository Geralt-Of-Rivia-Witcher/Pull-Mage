import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RegisterUserDto } from '../users/dtos/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/check-user-exists')
  async checkUserExists(
    @Query('gitHubUsername') gitHubUsername: string,
  ): Promise<boolean> {
    return await this.authService.checkUserExists(gitHubUsername);
  }

  @Post('/sign-up')
  handleSignUp(@Body() data: RegisterUserDto): Promise<User> {
    return this.authService.handleSignUp(data);
  }
}
