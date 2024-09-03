import { ApiProperty } from '@nestjs/swagger';
import { Book } from 'src/books/book.entity';
import { User } from 'src/user/user.entity';
import { Column, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class BookLoan {
  @ApiProperty({ description: 'Id unico del préstamo' })
  @PrimaryGeneratedColumn()
  BookLoanId: number;

  @ApiProperty({ description: 'Fecha en la que se solicita el préstamo' })
  @Column()
  LoanRequestDate: Date;

  @ApiProperty({ description: 'Fecha en la que se recoge el libro' })
  @Column()
  BookPickUpDate: Date;

  @ApiProperty({ description: 'Fecha en la que se debe devolver el libro' })
  @Column()
  LoanExpirationDate: Date;

  @ApiProperty({ description: 'Estado en el cual se encuentra el préstamo' })
  @Column()
  Status: string;

  // Relaciones
  @OneToMany(()=> Book, book => book.BookCode)
  Books: Book[];

  @ManyToOne(()=> User, user => user.UserId)
  user: User
}
