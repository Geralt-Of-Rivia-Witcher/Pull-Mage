import { Injectable } from '@nestjs/common';
import { IssueCommentActions } from './enums/issue-comment-actions.enum';
import { PullRequestEventService } from '../pull-request-event/pull-request-event.service';
import { IssueComments } from './enums/issue-comments.enum';
import { IHandleIssueCommentPayload } from './interfaces/handle-issue-comment-payload.interface';
import { ChatGptRequestType } from '../chat-gpt/interfaces/chat-gpt-request-type.interface';

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
    const commentType = comment.split('=')[0].trim();
    const additionalRequest = comment.split('=')[1]?.trim();

    if (commentType === IssueComments.REVIEW) {
      this.pullRequestEventService.performValidCommentAction({
        ...payload,
        type: ChatGptRequestType.PR_REVIEW,
      });
    } else if (commentType === IssueComments.EXPLAIN) {
      this.pullRequestEventService.performValidCommentAction({
        ...payload,
        type: ChatGptRequestType.CODE_EXPLANATION,
      });
    } else if (commentType === IssueComments.ASK) {
      this.pullRequestEventService.performValidCommentAction({
        ...payload,
        type: ChatGptRequestType.ASK_QUESTION,
        question: additionalRequest,
      });
    }
  }
}
