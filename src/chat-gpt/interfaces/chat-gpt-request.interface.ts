import { ChatGptRequestType } from './chat-gpt-request-type.interface';

export interface IChatGptRequest {
  type: ChatGptRequestType;
  fileChanges: string;
  question?: string;
}
