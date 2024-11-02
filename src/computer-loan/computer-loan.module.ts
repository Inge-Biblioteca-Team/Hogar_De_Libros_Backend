/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ComputerLoanController } from './computer-loan.controller';
import { ComputerLoanService } from './computer-loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComputerLoan } from './computer-loan.entity';
import { UserModule } from 'src/user/user.module';
import { WorkStationsModule } from 'src/work-stations/work-stations.module';

@Module({
  imports:[TypeOrmModule.forFeature([ComputerLoan]), WorkStationsModule, UserModule],
  controllers: [ComputerLoanController],
  providers: [ComputerLoanService]
})
export class ComputerLoanModule {}
