import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { IOpenAIConfig } from '../config/interface/config.interface';
import { IChatGptRequest } from './interfaces/chat-gpt-request.interface';
import { ChatGptRequestType } from './interfaces/chat-gpt-request-type.interface';

@Injectable()
export class ChatGptService {
  private readonly openai: OpenAI;
  private readonly openaiConfig: IOpenAIConfig;

  constructor(private readonly configService: ConfigService) {
    this.openaiConfig = this.configService.get<IOpenAIConfig>('openai');
    this.openai = new OpenAI({ apiKey: this.openaiConfig.apiKey });
  }

  async getGptResponse(ctx: IChatGptRequest): Promise<string> {
    const GptRequestToServiceMethod: Record<
      ChatGptRequestType,
      (payload: IChatGptRequest) => Promise<string>
    > = {
      [ChatGptRequestType.PR_REVIEW]: (payload) => {
        return this.getPrReview(payload.fileChanges);
      },
      [ChatGptRequestType.CODE_EXPLANATION]: (payload) => {
        return this.getCodeExplanation(payload.fileChanges);
      },
      [ChatGptRequestType.ASK_QUESTION]: (payload) => {
        return this.askQuestion(payload.question, payload.fileChanges);
      },
    };
    return GptRequestToServiceMethod[ctx.type](ctx);
  }

  private async getPrReview(fileChanges: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are reviewing a pull request and suggesting changes. Your role is to ensure code quality and correctness, and alignment with coding standards.',
        },
        {
          role: 'system',
          content:
            'Please provide detailed suggestions for improvements directly related to the changes made in the pull request. Focus on ensuring that the modifications align with project standards and maintain code quality.',
        },
        {
          role: 'system',
          content:
            'Consider the specific changes made in the pull request, including variable name changes, logic improvements, code quality enhancements, and adherence to design patterns.',
        },
        {
          role: 'system',
          content:
            'Avoid generating new code and instead provide clear and detailed recommendations for the author to implement within the context of the existing changes.',
        },
        {
          role: 'user',
          content: fileChanges,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
    // return 'This is a placeholder for the GPT response to save credits. #MaiGareebHoon';
  }

  private async getCodeExplanation(fileChanges: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            "Please provide an overview of the code changes included in the current pull request. Summarize the purpose and significance of these changes, including how they contribute to the project's functionality, correctness, and quality.",
        },
        {
          role: 'system',
          content:
            'Highlight the main objectives or goals achieved by these changes, the problems they solve, and any notable improvements or optimizations made to the codebase.',
        },
        {
          role: 'system',
          content:
            'Offer a high-level breakdown of the modifications, grouping related changes together and explaining their collective impact on the project.',
        },
        {
          role: 'user',
          content: fileChanges,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  }

  private async askQuestion(
    question: string,
    fileChanges: string,
  ): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are provided with a GitHub pull request file changes. Each change includes information such as filename, status (modified/added/deleted), additions, deletions, optional previous_filename, and the patches containing the actual code changes.',
        },
        {
          role: 'system',
          content:
            'Now, you need to answer a question related to the code changes. I will provide you with the question, and you need to answer it based on the provided file changes. Your response should focus on directly addressing the question with concise information extracted from the file changes.',
        },
        {
          role: 'user',
          content: `File Changes: ${fileChanges}`,
        },
        {
          role: 'user',
          content: `Question: ${question}`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
  }
}
