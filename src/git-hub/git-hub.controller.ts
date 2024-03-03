import { Controller, Get } from '@nestjs/common';
import { GitHubService } from './git-hub.service';

@Controller('git-hub')
export class GitHubController {
  constructor(private readonly gitHubService: GitHubService) {}

  @Get('/')
  getGitHub() {
    this.gitHubService.test();
  }
}
