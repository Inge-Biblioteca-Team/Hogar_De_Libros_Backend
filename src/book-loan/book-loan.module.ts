/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BookLoanController } from './book-loan.controller';
import { BookLoanService } from './book-loan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookLoan } from './book-loan.enity';
import { UserModule } from 'src/user/user.module';
import { BooksModule } from 'src/books/books.module';


@Module({
  imports:[
    UserModule,
    BooksModule,
    TypeOrmModule.forFeature([BookLoan])],
  controllers: [BookLoanController],
  providers: [BookLoanService],
  exports:[TypeOrmModule]
})
export class BookLoanModule {}
