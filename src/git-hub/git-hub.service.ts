import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { App, Octokit } from 'octokit';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { IGithubConfig } from '../config/interface/config.interface';
import { PullRequestEventService } from '../pull-request-event/pull-request-event.service';
import { IssueCommentService } from '../issue-comment/issue-comment.service';
import { IFileChange } from '../pull-request-event/interfaces/file-changes.interface';
import { WebhookEvents } from './enums/webhook-events.enum';
import { IPostCommentPayload } from './interfaces/post-comment-payload.interface';
import { IGetPullRequestFiles } from './interfaces/get-pull-request-files.interface';
import { IWekhookPayload } from './interfaces/github-wekhook.interface';

@Injectable()
export class GitHubService {
  private readonly gitHubConfig: IGithubConfig;
  private readonly octokitApp: App;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => PullRequestEventService))
    private readonly puPullRequestEventService: PullRequestEventService,
    private readonly issueCommentService: IssueCommentService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {
    this.gitHubConfig = this.configService.get<IGithubConfig>('github');
    this.octokitApp = new App({
      appId: this.gitHubConfig.appId,
      privateKey: this.gitHubConfig.privateKey,
      webhooks: {
        secret: this.gitHubConfig.webhoookSecret,
      },
    });
  }

  handleWebhookEvents(event: WebhookEvents, payload: IWekhookPayload) {
    const eventToServiceMethod: Record<
      WebhookEvents,
      (payload: IWekhookPayload) => void
    > = {
      [WebhookEvents.PULL_REQUEST]: (payload) => {
        this.puPullRequestEventService.handlePullRequestEvents({
          action: payload.action,
          owner: payload.repository.owner.login,
          repositoryName: payload.repository.name,
          issueNumber: payload.number,
          installationId: payload.installation.id,
        });
      },
      [WebhookEvents.ISSUE_COMMENT]: (payload) => {
        this.issueCommentService.handleIssueCommentEvents({
          action: payload.action,
          comment: payload.comment.body,
          owner: payload.repository.owner.login,
          repositoryName: payload.repository.name,
          issueNumber: payload.issue.number,
          installationId: payload.installation.id,
        });
      },
    };
    eventToServiceMethod[event](payload);
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
    const { owner, repositoryName, installationId, issueNumber } = ctx;
    const jwtToken = this.jwtService.sign(
      {
        iat: Math.floor(Date.now() / 1000) - 60,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        iss: this.gitHubConfig.appId,
      },
      {
        algorithm: 'RS256',
        privateKey: this.gitHubConfig.privateKey,
      },
    );
    const token = await firstValueFrom(
      this.httpService.post(
        `https://api.github.com/app/installations/${installationId}/access_tokens`,
        {},
        {
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${jwtToken}`,
            'x-github-api-version': '2022-11-28',
          },
        },
      ),
    );
    const octokit = new Octokit({
      auth: token.data.token,
    });
    const res = await octokit.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
      {
        owner: owner,
        repo: repositoryName,
        pull_number: issueNumber,
        headers: {
          'x-github-api-version': '2022-11-28',
        },
      },
    );
    return res.data;
  }
}
