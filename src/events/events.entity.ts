import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'events' })
export class events {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Id del evento' })
  EventId: number;

  @Column()
  @ApiProperty({ description: 'Ubicación del evento' })
  Location: string;

  @Column()
  @ApiProperty({ description: 'Titulo del evento' })
  Title: string;

  @Column()
  @ApiProperty({ description: 'Detalles del evento' })
  Details: string;

  @Column()
  @ApiProperty({ description: 'Categoría del evento' })
  Category: string;

  @Column()
  @ApiProperty({ description: 'Fecha del evento' })
  Date: Date;

  @Column({ type: 'time' })
  @ApiProperty({ description: 'Hora del evento' })
  Time: string;

  @Column()
  @ApiProperty({ description: 'Imagen del evento' })
  Image: string;

  @Column()
  @ApiProperty({ description: 'Público objetivo del evento' })
  TargetAudience: string;

  @Column({ type: 'char', length: 1, default: 'P' })
  @ApiProperty({ description: 'Estado del evento' })
  Status: string;

  @Column()
  @ApiProperty({ description: 'Persona encargada del evento' })
  InchargePerson: string;
}
