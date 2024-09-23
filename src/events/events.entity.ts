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
  @ApiProperty({ description: 'Fecha del evento' })
  Date: Date;

  @Column()
  @ApiProperty({ description: 'Imagen del evento' })
  Image: string;

  @Column()
  @ApiProperty({ description: 'Público objetivo del evento' })
  TargetAudience: string;

  @Column()
  @ApiProperty({ description: 'Estado del evento' })
  Status: boolean;

  @Column()
  @ApiProperty({ description: 'Persona encargada del evento' })
  InchargePerson: string;
}
