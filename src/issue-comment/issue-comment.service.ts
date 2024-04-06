import { Injectable } from '@nestjs/common';
import { PullRequestEventService } from '../pull-request-event/pull-request-event.service';
import { ChatGptRequestType } from '../chat-gpt/enums/chat-gpt-request-type.enum';
import { IssueCommentActions } from './enums/issue-comment-actions.enum';
import { IssueComments } from './enums/issue-comments.enum';
import { IHandleIssueCommentPayload } from './interfaces/handle-issue-comment-payload.interface';

@Injectable()
export class IssueCommentService {
  private readonly commentTypeToRequestType: Record<
    IssueComments,
    ChatGptRequestType
  >;
  constructor(
    private readonly pullRequestEventService: PullRequestEventService,
  ) {
    this.commentTypeToRequestType = {
      [IssueComments.REVIEW]: ChatGptRequestType.PR_REVIEW,
      [IssueComments.EXPLAIN]: ChatGptRequestType.CODE_EXPLANATION,
      [IssueComments.ASK]: ChatGptRequestType.ASK_QUESTION,
    };
  }

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

    const requestType = this.commentTypeToRequestType[commentType];

    if (requestType) {
      this.pullRequestEventService.performValidCommentAction({
        ...payload,
        type: requestType,
        question: additionalRequest,
      });
    }
  }
}
