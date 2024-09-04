import { Test, TestingModule } from '@nestjs/testing';
import { BookChildrenService } from './book-children.service';

describe('BookChildrenService', () => {
  let service: BookChildrenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookChildrenService],
    }).compile();

    service = module.get<BookChildrenService>(BookChildrenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
