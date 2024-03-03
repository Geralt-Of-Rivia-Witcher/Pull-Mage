import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PullRequestActionType } from './enums/pulll-request-actions.enum';
import { GitHubService } from '../git-hub-webhook/git-hub.service';

@Injectable()
export class PullRequestEventService {
  constructor(
    @Inject(forwardRef(() => GitHubService))
    private readonly gitHubService: GitHubService,
  ) {}

  handlePullRequestEvents(actionType: PullRequestActionType, payload: any) {
    if (actionType === PullRequestActionType.REOPENED) {
      this.gitHubService.postCommentOnPullRequest(
        'Thanks for opening this pull request!',
        payload,
      );
    }
  }
}
