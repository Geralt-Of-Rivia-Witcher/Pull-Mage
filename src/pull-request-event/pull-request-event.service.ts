import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PullRequestActionType } from './enums/pulll-request-actions.enum';
import { GitHubService } from '../git-hub/git-hub.service';
import { ChatGptService } from 'src/chat-gpt/chat-gpt.service';
import { IFileChange } from './interfaces/file-changes.interface';
import { IGetPrReview } from './interfaces/get-pr-review.interface';
import { IWekhookPayload } from '../git-hub/interfaces/github-wekhook.interface';

@Injectable()
export class PullRequestEventService {
  constructor(
    @Inject(forwardRef(() => GitHubService))
    private readonly gitHubService: GitHubService,
    private readonly chatGptService: ChatGptService,
  ) {}

  async handlePullRequestEvents(
    actionType: PullRequestActionType,
    payload: IWekhookPayload,
  ) {
    if (
      actionType === PullRequestActionType.REOPENED ||
      actionType === PullRequestActionType.OPENED
    ) {
      this.doPrReview({
        owner: payload.repository.owner.login,
        repositoryName: payload.repository.name,
        issueNumber: payload.issue.number,
        installationId: payload.installation.id,
      });
    }
  }

  async doPrReview(ctx: IGetPrReview) {
    const { owner, repositoryName, issueNumber, installationId } = ctx;
    const fileChanges = await this.gitHubService.getPullRequestFiles({
      owner,
      repositoryName,
      installationId,
    });
    const formattedFileChanges = this.reformattedFileChanges(fileChanges);
    const gptPrReview =
      await this.chatGptService.getPrReview(formattedFileChanges);
    this.gitHubService.postCommentOnPullRequest({
      message: gptPrReview,
      owner,
      repositoryName,
      issueNumber,
      installationId,
    });
  }

  private reformattedFileChanges(fileChanges: IFileChange[]): string {
    const formattedFileChanges = fileChanges.map((fileChange) => {
      return {
        filename: fileChange.filename,
        status: fileChange.status,
        additions: fileChange.additions,
        deletions: fileChange.deletions,
        patches: fileChange.patch,
        previous_filename: fileChange.previous_filename,
      };
    });
    return JSON.stringify(formattedFileChanges);
  }
}
