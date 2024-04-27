import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { RegisterUserDto } from './dtos/register-user.dto';
import { ICheckUserResponse } from './interface/check-user-response.interface';

@Injectable()
export class AuthService {
  private saltRounds: number;
  constructor(private readonly userService: UsersService) {
    this.saltRounds = 10;
  }

  async checkUserExists(gitHubUsername: string): Promise<ICheckUserResponse> {
    return this.userService.checkUserExists(gitHubUsername);
  }

  async handleSignUp(ctx: RegisterUserDto): Promise<User> {
    const { gitHubUsername, password } = ctx;

    const user = await this.userService.getUser(gitHubUsername);
    if (user && user.password) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    if (!user) {
      return this.userService.createUser({
        gitHubUsername,
        password: hashedPassword,
      });
    }

    if (!user.password) {
      return this.userService.updatePassword(gitHubUsername, hashedPassword);
    }
  }
}
