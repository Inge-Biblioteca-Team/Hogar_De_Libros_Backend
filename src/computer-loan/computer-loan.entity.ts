/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { WorkStation } from 'src/computers/WorkStation.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'computer_loan' })
export class ComputerLoan {
  @ApiProperty({ description: 'Id único del préstamo' })
  @PrimaryGeneratedColumn()
  ComputerLoanId: number;

  @ApiProperty({ description: 'Fecha en la que se solicita el préstamo' })
  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  LoanStartDate: Date;

  @ApiProperty({ description: 'Fecha en la que termina el préstamo' })
  @Column()
  LoanExpireDate: Date;

  @ApiProperty({ description: 'Estado en el cual se encuentra el préstamo' })
  @Column({ default: 'Solcitud' })
  Status: string;

  @ApiProperty({ description: 'Nombre del ususario solicitante del préstamo' })
  @Column()
  UserName: string;

  @ApiProperty({ description: 'Id del administrador que acepta el préstamo' })
  @Column()
  AdminId: number;

  // Relaciones
  @OneToMany(() => WorkStation, (workStation) => workStation.computerLoan)
  workStation: WorkStation[];

  @ManyToOne(() => User, (user) => user.computerLoan)
  user: User;
  computerLoan: WorkStation;
}
