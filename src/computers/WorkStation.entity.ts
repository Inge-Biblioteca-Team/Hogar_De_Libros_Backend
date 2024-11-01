/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Computer } from './computer.entity';
import { ComputerLoan } from 'src/computer-loan/computer-loan.entity';

@Entity({ name: 'workstations' })
/// SEPARAR DE COMPUTERS Y CREAR CRUD DE WORKSTATIONS ELIMINANDO totalmente no cambiar estado
export class WorkStation {
  @PrimaryGeneratedColumn()
  MachineNumber: number;

  @Column({ default: 'Biblioteca pública' })
  Location: string;

  @Column({ default: 'Disponible' })
  Status: string="Disponible";

  // Relaciones
  @OneToMany(() => Computer, (computer) => computer.workStation)
  computers: Computer[];

  @OneToMany(() => ComputerLoan, (computerLoan) => computerLoan.workStation)
  computerLoans: ComputerLoan[];
}
