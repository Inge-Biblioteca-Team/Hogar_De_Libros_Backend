/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'localartist' })
export class LocalArtist {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID' })
  ID: number;

  @Column()
  @ApiProperty({ description: 'Nombre completo' })
  Name: string;

  @Column()
  @ApiProperty({ description: 'Profecion Pintor Cantante o otro' })
  ArtisProfession: string;

  @Column()
  @ApiProperty({ description: 'URL de la foto' })
  Cover: string;

  @Column({ type: 'text'  })
  @ApiProperty({ description: 'Menciones y Demas' })
  MoreInfo: string;

  @Column()
  @ApiProperty({
    description: 'Estado del artista',
    default: true,
  })
  Actived: boolean = true;

  @Column()
  @ApiProperty({description: 'Red FB'})
  FBLink:string

  @Column()
  @ApiProperty({description: 'Red IG'})
  IGLink:string

  @Column()
  @ApiProperty({description: 'Red LI'})
  LILink:string
}
