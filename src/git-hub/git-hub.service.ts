import { Injectable } from '@nestjs/common';
import { App } from 'octokit';
import { ConfigService } from '@nestjs/config';
import { IGithubConfig } from 'src/config/interface/config.interface';

@Injectable()
export class GitHubService {
  private readonly gitHubConfig: IGithubConfig;
  private readonly octokitApp: App;

  constructor(private readonly configService: ConfigService) {
    this.gitHubConfig = this.configService.get<IGithubConfig>('github');
    this.octokitApp = new App({
      appId: this.gitHubConfig.appId,
      privateKey: this.gitHubConfig.privateKeyPath,
      webhooks: {
        secret: this.gitHubConfig.webhoookSecret,
      },
    });
  }

  test() {
    console.log(this.octokitApp);
    return this.octokitApp;
  }
}
