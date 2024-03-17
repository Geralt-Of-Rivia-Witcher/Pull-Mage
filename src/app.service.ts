import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  healthCheck(): string {
    return 'Pew Pew Pew 🔫🔫🔫';
  }
}
