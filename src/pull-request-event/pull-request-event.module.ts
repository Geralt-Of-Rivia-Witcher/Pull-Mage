import { Module, forwardRef } from '@nestjs/common';
import { GitHubModule } from '../git-hub/git-hub.module';
import { ChatGptModule } from '../chat-gpt/chat-gpt.module';
import { UsersModule } from '../users/users.module';
import { PullRequestEventService } from './pull-request-event.service';

@Module({
  imports: [forwardRef(() => GitHubModule), ChatGptModule, UsersModule],
  providers: [PullRequestEventService],
  exports: [PullRequestEventService],
})
export class PullRequestEventModule {}
