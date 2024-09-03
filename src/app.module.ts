import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/book.entity';
import { Computer } from './computers/computer.entity';
import { ComputersModule } from './computers/computers.module';
import { BookLoanModule } from './book-loan/book-loan.module';
import { UserModule } from './user/user.module';
import { ComputerLoanModule } from './computer-loan/computer-loan.module';
import { BookLoan } from './book-loan/book-loan.enity';
import { ComputerLoan } from './computer-loan/computer-loan.entity';
import { User } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'hogar_de_libros',
      entities: [Book, Computer, BookLoan, ComputerLoan, User],
      synchronize: true,
    }),
    BooksModule,
    ComputersModule,
    BookLoanModule,
    UserModule,
    ComputerLoanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
