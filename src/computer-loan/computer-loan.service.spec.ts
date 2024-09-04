import { Test, TestingModule } from '@nestjs/testing';
import { ComputerLoanService } from './computer-loan.service';

describe('ComputerLoanService', () => {
  let service: ComputerLoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComputerLoanService],
    }).compile();

    service = module.get<ComputerLoanService>(ComputerLoanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
