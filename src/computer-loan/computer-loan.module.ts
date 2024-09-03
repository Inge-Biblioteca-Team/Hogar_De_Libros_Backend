import { Module } from '@nestjs/common';
import { ComputerLoanController } from './computer-loan.controller';
import { ComputerLoanService } from './computer-loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComputerLoan } from './computer-loan.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ComputerLoan])],
  controllers: [ComputerLoanController],
  providers: [ComputerLoanService]
})
export class ComputerLoanModule {}
