import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { App, Octokit } from 'octokit';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { IGithubConfig } from '../config/interface/config.interface';
import { WebhookEvents } from './enums/webhook-events.enum';
import { PullRequestEventService } from '../pull-request-event/pull-request-event.service';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

@Injectable()
export class GitHubService {
  private readonly gitHubConfig: IGithubConfig;
  private readonly octokitApp;
  private readonly privateKeyFile;

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
    this.privateKeyFile = fs.readFileSync(
      this.gitHubConfig.privateKeyPath,
      'utf8',
    );
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

  async getPullRequestFiles(payload: any) {
    const jwtToken = jwt.sign(
      {
        iat: Math.floor(Date.now() / 1000) - 60,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        iss: this.gitHubConfig.appId,
      },
      this.privateKeyFile,
      { algorithm: 'RS256' },
    );
    const token = await axios.post(
      `https://api.github.com/app/installations/${payload.installation.id}/access_tokens`,
      {},
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${jwtToken}`,
          'x-github-api-version': '2022-11-28',
        },
      },
    );
    const octokit = new Octokit({
      auth: token.data.token,
    });
    const res = await octokit.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
      {
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        pull_number: 2,
        headers: {
          'x-github-api-version': '2022-11-28',
        },
      },
    );
    console.log(res);
  }
}
