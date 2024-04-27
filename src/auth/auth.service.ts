import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { IAppConfig } from '../config/interface/config.interface';
import { RegisterUserDto } from './dtos/register-user.dto';
import { ICheckUserResponse } from './interface/check-user-response.interface';
import { ILogInResponse } from './interface/login-user.interface';

@Injectable()
export class AuthService {
  private saltRounds: number;
  private readonly appConfig: IAppConfig;
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.saltRounds = 10;
    this.appConfig = this.configService.get<IAppConfig>('app');
  }

  async checkUserExists(gitHubUsername: string): Promise<ICheckUserResponse> {
    return this.userService.checkUserExists(gitHubUsername);
  }

  async handleLogIn(ctx: RegisterUserDto): Promise<ILogInResponse> {
    const { gitHubUsername, password } = ctx;

    const user = await this.userService.getUser(gitHubUsername);
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    if (!user) {
      await this.userService.createUser({
        gitHubUsername,
        password: hashedPassword,
      });
    } else if (!user.password) {
      await this.userService.updatePassword(gitHubUsername, hashedPassword);
    } else {
      const isPassrodCorrect = await bcrypt.compare(password, user.password);
      if (!isPassrodCorrect) {
        throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED);
      }
    }

    const accessToken = await this.jwtService.signAsync(
      {
        gitHubUsername,
      },
      {
        privateKey: this.appConfig.jwtSecret,
      },
    );

    return {
      accessToken,
    };
  }
}
