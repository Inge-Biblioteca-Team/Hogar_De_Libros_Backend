import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'books' })
export class Book {

    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'Código único del libro' })
    BookCode: string;
    
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
    ISBN: number;

    @Column()
    @ApiProperty({ description: 'Categoría del libro' })
    BookCategory: string;

    @Column()
    @ApiProperty({ description: 'URL de la portada del libro' })
    Cover:string;

    @Column()
    @ApiProperty({ description: 'Calificación de la condición del libro' })
    BookConditionRating:number;

    @Column()
    @ApiProperty({ description: 'Número de estante donde se encuentra el libro' })
    ShelfNumber:number;

    @Column()
    @ApiProperty({ description: 'Código de firma' })
    SignatureCode:number;

    @Column()
    @ApiProperty({ description: 'Código de inscripción' })
    InscriptionCode:number;

    @Column()
    @ApiProperty({ description: 'Indica si el libro está reservado' })
    Reserva :boolean;

  }