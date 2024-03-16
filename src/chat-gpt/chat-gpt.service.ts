import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import { IOpenAIConfig } from '../config/interface/config.interface';

@Injectable()
export class ChatGptService {
  private readonly openai;
  private readonly openaiConfig;

  constructor(private readonly configService: ConfigService) {
    this.openaiConfig = this.configService.get<IOpenAIConfig>('openai');
    this.openai = new OpenAI(this.openaiConfig.apiKey);
  }

  async getPrReview(fileChanges: string): Promise<string> {
    // const completion = await this.openai.chat.completions.create({
    //   messages: [
    //     {
    //       role: 'system',
    //       content:
    //         'You will be reviewing changes made in a pull request. Each change includes information such as filename, status (modified/added/deleted), additions, deletions, and the patches containing the actual code changes.',
    //     },
    //     {
    //       role: 'user',
    //       content: fileChanges,
    //     },
    //   ],
    //   model: 'gpt-3.5-turbo',
    // });

    // return completion.choices[0].message.content;
    return 'This is a placeholder for the GPT response to save credits. #MaiGareebHoon';
  }
}
