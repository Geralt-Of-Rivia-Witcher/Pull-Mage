export interface IHandleIssueCommentPayload {
  owner: string;
  repositoryName: string;
  issueNumber: number;
  installationId: number;
  comment: string;
  action: string;
}
