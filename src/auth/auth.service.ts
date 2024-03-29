import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  private saltRounds: number;
  constructor(private readonly userService: UsersService) {
    this.saltRounds = 10;
  }

  async handleSignUp(ctx: CreateUserDto): Promise<User> {
    const { username, password } = ctx;
    if (!username || !password) {
      throw new HttpException(
        'Username or password missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return this.userService.createUser({
      username,
      password: hashedPassword,
    });
  }
}
