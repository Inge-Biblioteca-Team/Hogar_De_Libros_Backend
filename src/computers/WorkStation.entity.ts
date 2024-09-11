import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Computer } from "./computer.entity";
import { ComputerLoan } from "src/computer-loan/computer-loan.entity";

@Entity({name: 'workstations'})
export class WorkStation {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  WorkStation: number;
  
  @Column()
  MachineNumber: number;

  @Column({default: 'Biblioteca pública'})
  Location: string;

  @Column({default: 'Disponible'})
  Status: string;

  // Relaciones
  @OneToMany(() => Computer, (computer) => computer.workStation)
  computers: Computer[];
  
  @ManyToOne(() => ComputerLoan, (computerLoan) => computerLoan.workStation)
  computerLoan: ComputerLoan;
}