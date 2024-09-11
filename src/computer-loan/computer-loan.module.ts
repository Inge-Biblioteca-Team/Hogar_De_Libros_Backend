/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ComputerLoanController } from './computer-loan.controller';
import { ComputerLoanService } from './computer-loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComputerLoan } from './computer-loan.entity';
import { ComputersModule } from 'src/computers/computers.module';

@Module({
  imports:[TypeOrmModule.forFeature([ComputerLoan]), ComputersModule],
  controllers: [ComputerLoanController],
  providers: [ComputerLoanService]
})
export class ComputerLoanModule {}
