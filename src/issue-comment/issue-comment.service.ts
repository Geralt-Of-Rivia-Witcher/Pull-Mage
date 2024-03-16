import { Injectable } from '@nestjs/common';
import { IssueCommentActions } from './enums/issue-comment-actions.enum';
import { PullRequestEventService } from '../pull-request-event/pull-request-event.service';
import { Comments } from './enums/comments.enum';
import { IHandleIssueCommentPayload } from './interfaces/handle-issue-comment-payload.interface';

@Injectable()
export class IssueCommentService {
  constructor(
    private readonly pullRequestEventService: PullRequestEventService,
  ) {}

  handleIssueCommentEvents(payload: IHandleIssueCommentPayload) {
    const { action } = payload;
    if (
      action === IssueCommentActions.CREATED ||
      action === IssueCommentActions.EDITED
    ) {
      this.matchCommentAndPerformAction(payload);
    }
  }

  matchCommentAndPerformAction(payload: IHandleIssueCommentPayload) {
    const { comment } = payload;

    if (comment === Comments.REVIEW) {
      this.pullRequestEventService.doPrReview(payload);
    }
  }
}
