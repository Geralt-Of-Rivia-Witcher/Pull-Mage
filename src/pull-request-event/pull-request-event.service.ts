import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PullRequestActionType } from './enums/pulll-request-actions.enum';
import { GitHubService } from '../git-hub-webhook/git-hub.service';
import { ChatGptService } from 'src/chat-gpt/chat-gpt.service';

@Injectable()
export class PullRequestEventService {
  constructor(
    @Inject(forwardRef(() => GitHubService))
    private readonly gitHubService: GitHubService,
    private readonly chatGptService: ChatGptService,
  ) {}

  async handlePullRequestEvents(
    actionType: PullRequestActionType,
    payload: any,
  ) {
    if (
      actionType === PullRequestActionType.REOPENED ||
      actionType === PullRequestActionType.OPENED
    ) {
      this.doPrReview(payload);
    }
  }

  async doPrReview(payload: any) {
    const fileChanges = await this.gitHubService.getPullRequestFiles(payload);
    const formattedFileChanges = JSON.stringify(
      this.reformattedFileChanges(fileChanges),
    );
    const gptPrReview =
      await this.chatGptService.getPrReview(formattedFileChanges);
    this.gitHubService.postCommentOnPullRequest(
      gptPrReview,
      payload,
      payload.issue.number,
    );
  }

  private reformattedFileChanges(fileChanges: any) {
    const formattedFileChanges = fileChanges.map((fileChange: any) => {
      return {
        filename: fileChange.filename,
        status: fileChange.status,
        additions: fileChange.additions,
        deletions: fileChange.deletions,
        patches: fileChange.patch,
      };
    });
    return JSON.stringify(formattedFileChanges);
  }
}
