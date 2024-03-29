import { Injectable } from '@nestjs/common';
import { UserDao } from './dao/user.dao';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly userDao: UserDao) {}

  async createUser(ctx: CreateUserDto): Promise<User> {
    return this.userDao.create(ctx);
  }
}
