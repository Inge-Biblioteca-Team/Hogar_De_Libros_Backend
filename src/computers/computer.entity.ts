/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { WorkStation } from '../work-stations/entities/work-station.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity({ name: 'computers' })
export class Computer {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Código único de equipo de cómputo' })
  EquipmentUniqueCode: number;

  @Column()
  @ApiProperty({ description: 'Número de maquina del equipo de cómputo' })
  MachineNumber: number;

  @Column()
  @ApiProperty({ description: 'Código serial de equipo de cómputo' })
  EquipmentSerial: string;

  @Column()
  @ApiProperty({ description: 'Marca del equipo de cómputo' })
  EquipmentBrand: string;

  @Column()
  @ApiProperty({
    description: 'Número de puntuacion del estado del equipo de cómputo',
  })
  ConditionRating: number;

  @Column()
  @ApiProperty({
    description: 'Observaciones del estado del equipo de cómputo',
  })
  Observation: string;

  @Column()
  @ApiProperty({ description: 'Categoría del equipo de cómputo' })
  EquipmentCategory: string;

  @Column()
  @ApiProperty({
    description: 'Estado del equipo de codigos (si esta de baja o no)',
    default: true,
  })
  Status: boolean = true;

  // Relaciones

  @ManyToOne(() => WorkStation, (workStation) => workStation.computers)
  @JoinColumn({ name: 'MachineNumber', referencedColumnName: 'MachineNumber' })
  workStation: WorkStation;
}
