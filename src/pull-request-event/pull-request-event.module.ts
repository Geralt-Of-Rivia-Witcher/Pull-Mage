import { Module } from '@nestjs/common';
import { GitHubModule } from '../git-hub-webhook/git-hub.module';

@Module({
  imports: [GitHubModule],
  providers: [],
  exports: [],
})
export class PullRequestEventModule {}
