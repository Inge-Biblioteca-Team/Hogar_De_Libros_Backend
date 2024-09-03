import { Test, TestingModule } from '@nestjs/testing';
import { ComputerLoanController } from './computer-loan.controller';

describe('ComputerLoanController', () => {
  let controller: ComputerLoanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComputerLoanController],
    }).compile();

    controller = module.get<ComputerLoanController>(ComputerLoanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
