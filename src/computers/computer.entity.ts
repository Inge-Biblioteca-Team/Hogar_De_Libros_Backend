import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'computers' })
export class Computer {
  @PrimaryGeneratedColumn()
  EquipmentUniqueCode: number;

  @Column()
  MachineNumber: number;

  @Column()
  EquipmentSerial: string;

  @Column()
  EquipmentBrand: string;

  @Column()
  ConditionRating: number;

  @Column()
  Observation: string;

  @Column()
  EquipmentCategory: string;
}
