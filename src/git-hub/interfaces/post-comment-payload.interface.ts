export interface IPostCommentPayload {
  message: string;
  owner: string;
  repositoryName: string;
  issueNumber: number;
  installationId: number;
}
