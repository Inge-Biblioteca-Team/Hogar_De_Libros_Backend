/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Computer } from 'src/computers/computer.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'computer_loan' }) 
export class ComputerLoan {
  @ApiProperty({ description: 'Id único del préstamo' })
  @PrimaryGeneratedColumn()  
  ComputerLoanId: number;

  @ApiProperty({ description: 'Fecha en la que se solicita el préstamo' })
  @Column()
  ComputerLoanReserveDate: Date;

  @ApiProperty({ description: 'Fecha en la que termina el préstamo' })
  @Column()
  ComputerLoanExpireDate: Date;

  @ApiProperty({ description: 'Estado en el cual se encuentra el préstamo' })
  @Column()
  Status: string;

  // Relaciones
  @OneToMany(() => Computer, computer => computer.computerLoan)
  Computers: Computer[];

  @ManyToOne(() => User, user => user.computerLoan)
  user: User;
}
