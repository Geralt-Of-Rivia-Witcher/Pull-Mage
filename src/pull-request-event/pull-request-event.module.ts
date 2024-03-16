import { Module, forwardRef } from '@nestjs/common';
import { GitHubModule } from '../git-hub-webhook/git-hub.module';
import { ChatGptModule } from '../chat-gpt/chat-gpt.module';
import { PullRequestEventService } from './pull-request-event.service';

@Module({
  imports: [forwardRef(() => GitHubModule), ChatGptModule],
  providers: [PullRequestEventService],
  exports: [PullRequestEventService],
})
export class PullRequestEventModule {}
