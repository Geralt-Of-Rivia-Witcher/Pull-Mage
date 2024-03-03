import { Test, TestingModule } from '@nestjs/testing';
import { PullRequestEventService } from './pull-request-event.service';

describe('PullRequestEventService', () => {
  let service: PullRequestEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PullRequestEventService],
    }).compile();

    service = module.get<PullRequestEventService>(PullRequestEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
