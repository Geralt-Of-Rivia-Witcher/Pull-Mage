import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GitHubService } from './git-hub/git-hub.service';
import { GitHubController } from './git-hub/git-hub.controller';
import { GitHubModule } from './git-hub/git-hub.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    GitHubModule,
  ],
  controllers: [AppController, GitHubController],
  providers: [AppService, GitHubService],
})
export class AppModule {}
