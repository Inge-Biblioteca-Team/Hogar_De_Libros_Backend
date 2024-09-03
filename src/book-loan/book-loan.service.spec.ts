import { Test, TestingModule } from '@nestjs/testing';
import { BookLoanService } from './book-loan.service';

describe('BookLoanService', () => {
  let service: BookLoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookLoanService],
    }).compile();

    service = module.get<BookLoanService>(BookLoanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
