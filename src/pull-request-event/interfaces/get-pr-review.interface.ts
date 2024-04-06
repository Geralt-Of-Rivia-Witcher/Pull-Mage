import { ChatGptRequestType } from '../../chat-gpt/enums/chat-gpt-request-type.enum';

export interface IValidCommentRequest {
  owner: string;
  repositoryName: string;
  issueNumber: number;
  installationId: number;
  type: ChatGptRequestType;
  question?: string;
}
