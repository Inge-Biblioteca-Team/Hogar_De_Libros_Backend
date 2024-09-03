import { Module } from '@nestjs/common';
import { ComputerLoanController } from './computer-loan.controller';
import { ComputerLoanService } from './computer-loan.service';

@Module({
  controllers: [ComputerLoanController],
  providers: [ComputerLoanService]
})
export class ComputerLoanModule {}
