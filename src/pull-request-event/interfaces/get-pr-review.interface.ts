import { ChatGptRequestType } from '../../chat-gpt/interfaces/chat-gpt-request-type.interface';

export interface IValidCommentRequest {
  owner: string;
  repositoryName: string;
  issueNumber: number;
  installationId: number;
  type: ChatGptRequestType;
  question?: string;
}
