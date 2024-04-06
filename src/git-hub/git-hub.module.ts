import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { PullRequestEventService } from '../pull-request-event/pull-request-event.service';
import { ChatGptModule } from '../chat-gpt/chat-gpt.module';
import { IssueCommentModule } from '../issue-comment/issue-comment.module';
import { GitHubController } from './git-hub.controller';
import { GitHubService } from './git-hub.service';

@Module({
  imports: [
    ChatGptModule,
    IssueCommentModule,
    HttpModule,
    JwtModule,
    UsersModule,
  ],
  controllers: [GitHubController],
  providers: [GitHubService, PullRequestEventService],
  exports: [GitHubService],
})
export class GitHubModule {}
