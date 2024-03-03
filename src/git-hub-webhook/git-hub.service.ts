import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { App } from 'octokit';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { IGithubConfig } from '../config/interface/config.interface';
import { WebhookEvents } from './enums/webhook-events.enum';
import { PullRequestEventService } from '../pull-request-event/pull-request-event.service';

@Injectable()
export class GitHubService {
  private readonly gitHubConfig: IGithubConfig;
  private readonly octokitApp;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => PullRequestEventService))
    private readonly puPullRequestEventService: PullRequestEventService,
  ) {
    this.gitHubConfig = this.configService.get<IGithubConfig>('github');
    this.octokitApp = new App({
      appId: this.gitHubConfig.appId,
      privateKey: fs.readFileSync(this.gitHubConfig.privateKeyPath, 'utf8'),
      webhooks: {
        secret: this.gitHubConfig.webhoookSecret,
      },
    });
  }

  handleWebhookEvents(event: WebhookEvents, payload: any) {
    this.puPullRequestEventService.handlePullRequestEvents(
      payload.action,
      payload,
    );
    return '';
  }

  async postCommentOnPullRequest(message: string, payload: any) {
    const octokit = await this.octokitApp.getInstallationOctokit(
      payload.installation.id,
    );

    await octokit.request(
      'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.pull_request.number,
        body: message,
        headers: {
          'x-github-api-version': '2022-11-28',
        },
      },
    );
  }
}
