import { Module } from '@nestjs/common';
import { BookLoanController } from './book-loan.controller';
import { BookLoanService } from './book-loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports:[TypeOrmModule.forFeature([])],
  controllers: [BookLoanController],
  providers: [BookLoanService]
})
export class BookLoanModule {}
