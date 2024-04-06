import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserDao {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getUser(gitHubUsername: string): Promise<User> {
    return await this.userModel.findOne({ gitHubUsername });
  }

  async create(ctx: CreateUserDto) {
    return await this.userModel.create(ctx);
  }
}
