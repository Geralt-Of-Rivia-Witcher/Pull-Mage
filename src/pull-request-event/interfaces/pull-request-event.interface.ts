export interface IPullRequestEvent {
  owner: string;
  repositoryName: string;
  issueNumber: number;
  installationId: number;
  action: string;
}
