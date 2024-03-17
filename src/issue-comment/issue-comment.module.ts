import { Module } from '@nestjs/common';
import { PullRequestEventModule } from '../pull-request-event/pull-request-event.module';
import { IssueCommentService } from './issue-comment.service';

@Module({
  imports: [PullRequestEventModule],
  providers: [IssueCommentService],
  exports: [IssueCommentService],
})
export class IssueCommentModule {}
