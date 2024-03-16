import { Body, Controller, Headers, Post } from '@nestjs/common';
import { GitHubService } from './git-hub.service';
import { WebhookEvents } from './enums/webhook-events.enum';
import { IWekhookPayload } from './interfaces/github-wekhook.interface';

@Controller('git-hub')
export class GitHubController {
  constructor(private readonly gitHubService: GitHubService) {}

  @Post('/webhook')
  handlePullRequestEvent(
    @Headers('X-GitHub-Event') event: WebhookEvents,
    @Body() payload: IWekhookPayload,
  ) {
    return this.gitHubService.handleWebhookEvents(event, payload);
  }
}
