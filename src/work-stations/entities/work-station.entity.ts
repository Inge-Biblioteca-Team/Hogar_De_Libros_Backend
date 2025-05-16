/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ComputerLoan } from '../../computer-loan/computer-loan.entity';
import { Computer } from '../../computers/computer.entity';

@Entity({ name: 'workstations' })

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
