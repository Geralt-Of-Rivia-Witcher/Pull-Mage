import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from '../users/dtos/create-user.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  private saltRounds: number;
  constructor(private readonly userService: UsersService) {
    this.saltRounds = 10;
  }

  async checkUserExists(gitHubUsername: string): Promise<boolean> {
    if (!gitHubUsername) {
      throw new HttpException(
        'GitHub username missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.checkUserExists(gitHubUsername);
  }

  async handleSignUp(ctx: RegisterUserDto): Promise<User> {
    const { gitHubUsername, password } = ctx;

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return this.userService.createUser({
      gitHubUsername,
      password: hashedPassword,
    });
  }
}
