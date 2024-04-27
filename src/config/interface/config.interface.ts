export interface IGithubConfig {
  appId: string;
  webhoookSecret: string;
  privateKey: string;
}

export interface IAppConfig {
  port: string;
  jwtSecret: string;
}

export interface IOpenAIConfig {
  apiKey: string;
}

export interface IConfig {
  github: IGithubConfig;
  app: IAppConfig;
  openai: IOpenAIConfig;
}
