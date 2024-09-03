import { Module } from '@nestjs/common';
import { BookLoanController } from './book-loan.controller';
import { BookLoanService } from './book-loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookLoan } from './book-loan.enity';


@Module({
  imports:[TypeOrmModule.forFeature([BookLoan])],
  controllers: [BookLoanController],
  providers: [BookLoanService]
})
export class BookLoanModule {}
