import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { UpdateOpenAIApiKeyDto } from './dtos/update-openai-api-key.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post('update-openai-api-key')
  async updateOpenAIApiKey(
    @Req() req: Request,
    @Body() data: UpdateOpenAIApiKeyDto,
  ): Promise<User> {
    return await this.usersService.updateOpenAIApiKey(req, data);
  }
}
