import { IConfig } from './interface/config.interface';

export const config = (): IConfig => ({
  app: {
    port: process.env.APP_PORT,
  },
  github: {
    appId: process.env.GITHUB_APP_ID,
    webhoookSecret: process.env.GITHUB_WEBHOOK_SECRET,
    privateKey: process.env.GITHUB_PRIVATE_KEY,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
});
