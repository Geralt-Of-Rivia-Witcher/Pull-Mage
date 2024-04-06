import { ChatGptRequestType } from '../enums/chat-gpt-request-type.enum';

export interface IChatGptRequest {
  type: ChatGptRequestType;
  fileChanges: string;
  question?: string;
}
