import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ChatGptService } from 'src/chat-gpt/chat-gpt.service';
import { GitHubService } from '../git-hub/git-hub.service';
import { PullRequestActionType } from './enums/pulll-request-actions.enum';
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
    const message =
      '\n🤖 **Greetings, coder! I am Pull Mage, your mighty Pull Request Assistant!** 🚀\n\n' +
      "I'm here to help you with your PRs by providing reviews, explanations, and answering your questions.\n\n" +
      "Here's what I can do:\n\n" +
      '1. **Review your PR**: Type `/review` to request a review of your pull request.\n\n' +
      '2. **Explain your PR**: Type `/explain` to get a detailed explanation of the changes included in your pull request.\n\n' +
      "3. **Ask a question**: Type `/ask = ` followed by your question to get answers related to your pull request. Provide the question after the '=' sign, and Pull Mage will do its best to answer within the context of your PR.\n\n" +
      "Feel free to interact with me whenever you need assistance with your PRs! Simply use one of the commands above, and I'll be at your service.\n\n" +
      'Happy coding! 🚀';
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
