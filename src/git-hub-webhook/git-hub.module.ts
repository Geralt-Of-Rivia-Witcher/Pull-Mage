import { Module } from '@nestjs/common';
import { GitHubController } from './git-hub.controller';
import { GitHubService } from './git-hub.service';
import { PullRequestEventService } from '../pull-request-event/pull-request-event.service';
import { ChatGptModule } from '../chat-gpt/chat-gpt.module';

@Module({
  imports: [ChatGptModule],
  controllers: [GitHubController],
  providers: [GitHubService, PullRequestEventService],
  exports: [GitHubService],
})
export class GitHubModule {}
