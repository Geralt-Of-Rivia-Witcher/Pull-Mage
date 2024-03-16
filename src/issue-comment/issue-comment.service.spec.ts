import { Test, TestingModule } from '@nestjs/testing';
import { IssueCommentService } from './issue-comment.service';

describe('IssueCommentService', () => {
  let service: IssueCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IssueCommentService],
    }).compile();

    service = module.get<IssueCommentService>(IssueCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
