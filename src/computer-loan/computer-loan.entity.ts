import { ApiProperty } from '@nestjs/swagger';
import { Computer } from 'src/computers/computer.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ComputerLoan' })
export class ComputerLoan {
  @ApiProperty({ description: 'Id unico del préstamo' })
  @PrimaryColumn()
  ComputerLoanId: number;

  @ApiProperty({ description: 'Fecha en la que se solicita el préstamo' })
  @Column()
  ComputerLoanReserveDate: Date;

  @ApiProperty({ description: 'Fecha en la termina el préstamo' })
  @Column()
  ComputerLoanExpireDate: Date;

  @ApiProperty({ description: 'Estado en el cual se encuentra el préstamo' })
  @Column()
  Status: string;

  // Relaciones

  @OneToMany(() => Computer, computer => computer.MachineNumber)
  Computers: Computer[];

  @ManyToOne(() => User, user => user.UserId)
  user: User;
}
