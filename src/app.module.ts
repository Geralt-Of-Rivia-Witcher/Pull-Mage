import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitHubController } from './git-hub/git-hub.controller';
import { GitHubModule } from './git-hub/git-hub.module';
import { ChatGptModule } from './chat-gpt/chat-gpt.module';
import { IssueCommentModule } from './issue-comment/issue-comment.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRoot('mongodb://localhost/nest'),
    GitHubModule,
    ChatGptModule,
    IssueCommentModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, GitHubController],
  providers: [AppService],
})
export class AppModule {}
