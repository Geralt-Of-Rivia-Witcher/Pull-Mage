import { Injectable } from '@nestjs/common';
import { IssueCommentActions } from './enums/issue-comment-actions.enum';
import { PullRequestEventService } from '../pull-request-event/pull-request-event.service';
import { Comments } from './enums/comments.enum';

@Injectable()
export class IssueCommentService {
  constructor(
    private readonly pullRequestEventService: PullRequestEventService,
  ) {}

  handleIssueCommentEvents(action: IssueCommentActions, payload: any) {
    if (
      action === IssueCommentActions.CREATED ||
      action === IssueCommentActions.EDITED
    ) {
      this.handleCommentAndPerformAction(payload.comment.body, payload);
    }
  }

  handleCommentAndPerformAction(comment: string, payload: any) {
    if (comment === Comments.REVIEW) {
      this.pullRequestEventService.doPrReview(payload);
    }
  }
}
