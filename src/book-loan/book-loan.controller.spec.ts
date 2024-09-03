import { Test, TestingModule } from '@nestjs/testing';
import { BookLoanController } from './book-loan.controller';

describe('BookLoanController', () => {
  let controller: BookLoanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookLoanController],
    }).compile();

    controller = module.get<BookLoanController>(BookLoanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
