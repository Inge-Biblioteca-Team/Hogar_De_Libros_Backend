/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { WorkStation } from '../work-stations/entities/work-station.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'computer_loan' })
export class ComputerLoan {
  @ApiProperty({ description: 'Id único del préstamo' })
  @PrimaryGeneratedColumn()
  ComputerLoanId: number;

  @ApiProperty({ description: 'Fecha en la que se solicita el préstamo' })
  @Column()
  LoanStartDate: Date;

  @ApiProperty({ description: 'Fecha en la que termina el préstamo' })
  @Column({nullable: true})
  LoanExpireDate: Date | null;

  @ApiProperty({ description: 'Estado en el cual se encuentra el préstamo' })
  @Column({ default: 'En curso' })
  Status: string;

  @ApiProperty({ description: 'Nombre del ususario solicitante del préstamo' })
  @Column()
  UserName: string;

  @ApiProperty({ description: 'Id del administrador que acepta el préstamo' })
  @Column()
  cedula: string;

  @ApiProperty({ description: 'WorkStation del préstamo' })
  @Column()
  MachineNumber: number;
  
  // Relaciones
  @ManyToOne(() => WorkStation, (workStation) => workStation.computerLoans)
  @JoinColumn({ name: 'MachineNumber', referencedColumnName: 'MachineNumber' })
  workStation: WorkStation;
}
