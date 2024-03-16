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
    const { type, fileChanges, question } = ctx;
    if (type === ChatGptRequestType.PR_REVIEW) {
      return this.getPrReview(fileChanges);
    } else if (type === ChatGptRequestType.CODE_EXPLANATION) {
      return this.getCodeExplanation(fileChanges);
    } else if (type === ChatGptRequestType.ASK_QUESTION) {
      return this.askQuestion(question, fileChanges);
    }
  }

  private async getPrReview(fileChanges: string): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are reviewing a pull request and suggesting changes. Your role is to ensure code quality, correctness, and alignment with project standards.',
        },
        {
          role: 'system',
          content:
            'Consider everything from variable name changes to logic improvement, code quality, design patterns, performance, security, dependencies, and more.',
        },
        {
          role: 'system',
          content:
            'Please provide detailed suggestions for improvements, covering all aspects of the code changes. Each change includes information such as filename, status (modified/added/deleted), additions, deletions, optional previous_filename and the patches containing the actual code changes.',
        },
        {
          role: 'system',
          content:
            'Avoid generating new code and instead provide clear and detailed recommendations for the author to implement.',
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
            'Please provide a detailed explanation of the code changes included in the current pull request. Each change includes information such as filename, status (modified/added/deleted), additions, deletions, optional previous_filename and the patches containing the actual code changes.',
        },
        {
          role: 'system',
          content:
            'Describe the purpose of the changes, the problem they aim to solve, and any relevant context or background information. Explain how each change contributes to the overall functionality, correctness, and quality of the codebase.',
        },
        {
          role: 'system',
          content:
            'Break down the changes into manageable chunks and provide clear explanations for each modification.',
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
            'You are provided with a GitHub pull request file changes. Each change includes information such as filename, status (modified/added/deleted), additions, deletions, optional previous_filename and the patches containing the actual code changes.',
        },
        {
          role: 'system',
          content:
            'Now, you need to answer a question related to the code changes. I will provide you with the question, and you need to answer it based on the provided file changes.',
        },
        {
          role: 'system',
          content:
            'Break down the answer into manageable chunks and provide clear explanations.',
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
