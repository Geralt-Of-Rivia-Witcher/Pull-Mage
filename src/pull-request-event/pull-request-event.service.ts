import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PullRequestActionType } from './enums/pulll-request-actions.enum';
import { GitHubService } from '../git-hub/git-hub.service';
import { ChatGptService } from 'src/chat-gpt/chat-gpt.service';
import { IFileChange } from './interfaces/file-changes.interface';
import { IValidCommentRequest } from './interfaces/get-pr-review.interface';
import { IPullRequestEvent } from './interfaces/pull-request-event.interface';

@Injectable()
export class PullRequestEventService {
  constructor(
    @Inject(forwardRef(() => GitHubService))
    private readonly gitHubService: GitHubService,
    private readonly chatGptService: ChatGptService,
  ) {}

  async handlePullRequestEvents(payload: IPullRequestEvent) {
    const { action } = payload;
    if (
      action === PullRequestActionType.REOPENED ||
      action === PullRequestActionType.OPENED
    ) {
      this.sendIntroductionMessage(payload);
    }
  }

  async sendIntroductionMessage(ctx: IPullRequestEvent) {
    const message = `🤖 Hello! I'm a bot designed to assist with pull request reviews.
    To trigger my review, please add a comment containing the word "/review".`;
    this.gitHubService.postCommentOnPullRequest({
      ...ctx,
      message,
    });
  }

  async performValidCommentAction(ctx: IValidCommentRequest) {
    const fileChanges = await this.gitHubService.getPullRequestFiles(ctx);
    const formattedFileChanges = this.reformattedFileChanges(fileChanges);
    const gptPrReview = await this.chatGptService.getGptResponse({
      ...ctx,
      fileChanges: formattedFileChanges,
    });
    this.gitHubService.postCommentOnPullRequest({
      ...ctx,
      message: gptPrReview,
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
