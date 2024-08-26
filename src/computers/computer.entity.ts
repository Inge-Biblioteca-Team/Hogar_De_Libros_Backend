import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('Computer')
export class Computer{
    @PrimaryGeneratedColumn()
    ComputerId: number;
    @Column()
    EquipmentCode: string;
    @Column()
    ComputerTyoe: string;
    @Column()
    ComputerConditionRating: number;
    @Column()
    ComputerStatus: string;
}