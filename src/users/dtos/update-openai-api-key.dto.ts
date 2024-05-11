import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOpenAIApiKeyDto {
  @IsString()
  @IsNotEmpty()
  openAIapiKey: string;
}
