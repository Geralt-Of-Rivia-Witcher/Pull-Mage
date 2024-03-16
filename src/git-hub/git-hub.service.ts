import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { App, Octokit } from 'octokit';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { IGithubConfig } from '../config/interface/config.interface';
import { WebhookEvents } from './enums/webhook-events.enum';
import { PullRequestEventService } from '../pull-request-event/pull-request-event.service';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';
import { IssueCommentService } from '../issue-comment/issue-comment.service';
import { IPostCommentPayload } from './interfaces/post-comment-payload.interface';
import { IGetPullRequestFiles } from './interfaces/get-pull-request-files.interface';
import { IWekhookPayload } from './interfaces/github-wekhook.interface';
import { IFileChange } from '../pull-request-event/interfaces/file-changes.interface';

@Injectable()
export class GitHubService {
  private readonly gitHubConfig: IGithubConfig;
  private readonly octokitApp;
  private readonly privateKeyFile;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => PullRequestEventService))
    private readonly puPullRequestEventService: PullRequestEventService,
    private readonly issueCommentService: IssueCommentService,
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

  handleWebhookEvents(event: WebhookEvents, payload: IWekhookPayload) {
    if (event === WebhookEvents.PULL_REQUEST) {
      this.puPullRequestEventService.handlePullRequestEvents(
        payload.action,
        payload,
      );
    } else if (event === WebhookEvents.ISSUE_COMMENT) {
      this.issueCommentService.handleIssueCommentEvents({
        action: payload.action,
        comment: payload.comment.body,
        owner: payload.repository.owner.login,
        repositoryName: payload.repository.name,
        issueNumber: payload.issue.number,
        installationId: payload.installation.id,
      });
    }
  }

  async postCommentOnPullRequest(ctx: IPostCommentPayload) {
    const { message, owner, repositoryName, issueNumber, installationId } = ctx;
    const octokit =
      await this.octokitApp.getInstallationOctokit(installationId);

    await octokit.request(
      'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        owner: owner,
        repo: repositoryName,
        issue_number: issueNumber,
        body: message,
        headers: {
          'x-github-api-version': '2022-11-28',
        },
      },
    );
  }

  async getPullRequestFiles(ctx: IGetPullRequestFiles): Promise<IFileChange[]> {
    const { owner, repositoryName, installationId } = ctx;
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
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
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
        owner: owner,
        repo: repositoryName,
        pull_number: 4,
        headers: {
          'x-github-api-version': '2022-11-28',
        },
      },
    );
    return res.data;
  }
}
