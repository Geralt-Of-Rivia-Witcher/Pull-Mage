import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
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

  @Post('/log-in')
  async handleSignUp(
    @Body() data: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.handleLogIn(data);
    response.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
}
