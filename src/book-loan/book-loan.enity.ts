/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Book } from 'src/books/book.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'book_loans' }) 
export class BookLoan {
  @ApiProperty({ description: 'Id único del préstamo' })
  @PrimaryGeneratedColumn()
  BookLoanId: number;

  @ApiProperty({ description: 'Fecha en la que se solicita el préstamo' })
  @Column({ type: 'datetime' })
  LoanRequestDate: Date;

  @ApiProperty({ description: 'Fecha en la que se recoge el libro' })
  @Column({ type: 'date' })
  BookPickUpDate: Date;

  @ApiProperty({ description: 'Fecha en la que se debe devolver el libro' })
  @Column({ type: 'date' })
  LoanExpirationDate: Date;

  @ApiProperty({ description: 'Estado en el cual se encuentra el préstamo' })
  @Column()
  Status: string = "Pendiente";

  @ApiProperty({ description: 'Observaciones ' })
  @Column()
  Observations: string ="";


  @ApiProperty({ description: 'BookCode ' })
  @Column()
  bookBookCode: number;


  @Column()
  userCedula:string;

  // Relaciones
  @ManyToOne(() => Book, book => book.bookLoans,{ eager: true })
  book: Book;

  @ManyToOne(() => User, user => user.bookLoans,{ eager: true })
  user: User;
}
