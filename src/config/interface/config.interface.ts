export interface IGithubConfig {
  appId: string;
  webhoookSecret: string;
  privateKey: string;
}

interface IAppConfig {
  port: string;
}

export interface IOpenAIConfig {
  apiKey: string;
}

export interface IConfig {
  github: IGithubConfig;
  app: IAppConfig;
  openai: IOpenAIConfig;
}
