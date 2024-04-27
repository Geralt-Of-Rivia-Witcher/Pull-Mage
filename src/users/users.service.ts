import { Injectable } from '@nestjs/common';
import { ICheckUserResponse } from 'src/auth/interface/check-user-response.interface';
import { RegisterUserDto } from '../auth/dtos/register-user.dto';
import { UserDao } from './dao/user.dao';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly inputCostPerMillionTokens: number;
  private readonly outputCostPerMillionTokens: number;
  private readonly million: number;
  private readonly freeCreditLimit: number;
  constructor(private readonly userDao: UserDao) {
    this.inputCostPerMillionTokens = 0.5;
    this.outputCostPerMillionTokens = 1.5;
    this.million = 1000000;
    this.freeCreditLimit = 0.095;
  }

  async checkUserExists(gitHubUsername: string): Promise<ICheckUserResponse> {
    const user = await this.userDao.getUser(gitHubUsername);
    if (!user) {
      return { userExists: false, isSignedUp: false };
    }
    if (!user.password) {
      return { userExists: true, isSignedUp: false };
    }
    return { userExists: true, isSignedUp: true };
  }

  async getOrCreateUser(gitHubUsername: string): Promise<User> {
    const user = await this.userDao.getUser(gitHubUsername);
    if (user) {
      return user;
    }
    return this.userDao.create({ gitHubUsername });
  }

  async createUser(ctx: RegisterUserDto): Promise<User> {
    return this.userDao.create(ctx);
  }

  async canPerformAction(gitHubUsername: string): Promise<boolean> {
    const user = await this.getOrCreateUser(gitHubUsername);
    const consumedCredits = this.calculateConsumedCredits(
      user.inputTokensConsumed,
      user.outputTokensConsumed,
    );
    return consumedCredits <= this.freeCreditLimit;
  }

  private calculateConsumedCredits(
    inputTokensConsumed: number,
    outputTokensConsumed: number,
  ): number {
    return (
      (this.inputCostPerMillionTokens / this.million) * inputTokensConsumed +
      (this.outputCostPerMillionTokens / this.million) * outputTokensConsumed
    );
  }

  async getUser(gitHubUsername: string): Promise<User | null> {
    return this.userDao.getUser(gitHubUsername);
  }

  async updatePassword(
    gitHubUsername: string,
    password: string,
  ): Promise<User> {
    return this.userDao.updatePassword(gitHubUsername, password);
  }
}
