import { Module } from '@nestjs/common';
import { IssueCommentService } from './issue-comment.service';
import { PullRequestEventModule } from '../pull-request-event/pull-request-event.module';

@Module({
  imports: [PullRequestEventModule],
  providers: [IssueCommentService],
  exports: [IssueCommentService],
})
export class IssueCommentModule {}
