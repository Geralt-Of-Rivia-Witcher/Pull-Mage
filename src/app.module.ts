import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitHubController } from './git-hub-webhook/git-hub.controller';
import { GitHubModule } from './git-hub-webhook/git-hub.module';
import { ChatGptModule } from './chat-gpt/chat-gpt.module';
import { IssueCommentModule } from './issue-comment/issue-comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    GitHubModule,
    ChatGptModule,
    IssueCommentModule,
  ],
  controllers: [AppController, GitHubController],
  providers: [AppService],
})
export class AppModule {}
