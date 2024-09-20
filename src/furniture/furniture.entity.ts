/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'furniture' })
export class Furniture {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID' })
  Id: number;

  @Column()
  @ApiProperty({ description: 'Nombre completo' })
  Description: string;

  @Column()
  @ApiProperty({ description: 'Nombre completo' })
  Location: string;

  @Column()
  @ApiProperty({ description: 'Nombre completo' })
  InChargePerson: string;

  @Column()
  @ApiProperty({ description: 'Nombre completo' })
  ConditionRating: number;

  @Column()
  @ApiProperty({ description: 'Nombre completo' })
  Status: string = "S.E.";

  @Column()
  @ApiProperty({description:'Numero de placa'})
  LicenseNumber:string;
}

