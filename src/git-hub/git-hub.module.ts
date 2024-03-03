import { Module } from '@nestjs/common';
import { GitHubController } from './git-hub.controller';
import { GitHubService } from './git-hub.service';

@Module({
  controllers: [GitHubController],
  providers: [GitHubService],
})
export class GitHubModule {}
