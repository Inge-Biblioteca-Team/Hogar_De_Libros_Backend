import { ApiProperty } from "@nestjs/swagger";
import { BookLoan } from "src/book-loan/book-loan.enity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'books' })
export class Book {

    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'Código  del libro' })
    BookCode: number;
    
    @Column()
    @ApiProperty({ description: 'Título del libro' })
    Title: string;

    @Column()
    @ApiProperty({ description: 'Autor del libro' })
    Author: string;

    @Column()
    @ApiProperty({ description: 'Editorial del libro' })
    Editorial: string;


    @Column()
    @ApiProperty({ description: 'Año de publicación' })
    PublishedYear: number;


    @Column()
    @ApiProperty({ description: 'ISBN del libro' })
    ISBN: string;

    @Column()
    @ApiProperty({ description: 'Categoría del libro' })
    ShelfCategory: string;

    @Column()
    @ApiProperty({ description: 'URL de la portada del libro' })
    Cover:string;

    @Column()
    @ApiProperty({ description: 'Calificación de la condición del libro' })
    BookConditionRating:number;

    @Column()
    @ApiProperty({ description: 'Código de firma' })
    SignatureCode:string;

    @Column()
    @ApiProperty({ description: 'Código de inscripción' })
    InscriptionCode:string;

    @Column()
    @ApiProperty({ description: 'Indica si el libro se puede está reservar' })
    ReserveBook:boolean;

    @Column()
    @ApiProperty({ description: 'Observaciones' })
    Observations :string;

    @Column()
    @ApiProperty({ description: 'Indica si esta deshabilitado' })
    Status :boolean=true;

    // relaciones

    @ManyToOne(() => BookLoan, bookLoan => bookLoan.BookLoanId)
    bookLoan: BookLoan;

  }