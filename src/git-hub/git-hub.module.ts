import { Module } from '@nestjs/common';
import { GitHubController } from './git-hub.controller';
import { GitHubService } from './git-hub.service';
import { PullRequestEventService } from '../pull-request-event/pull-request-event.service';
import { ChatGptModule } from '../chat-gpt/chat-gpt.module';
import { IssueCommentModule } from '../issue-comment/issue-comment.module';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ChatGptModule, IssueCommentModule, HttpModule, JwtModule],
  controllers: [GitHubController],
  providers: [GitHubService, PullRequestEventService],
  exports: [GitHubService],
})
export class GitHubModule {}
