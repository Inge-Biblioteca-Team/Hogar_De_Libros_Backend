/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';

export class GetEnrollmentsDTO {
  @ApiProperty({ description: 'Nmero de matricula ' })
  enrollmentId: number;

  @ApiProperty({ description: 'UserCedula ' })
  userCedula?: string;

  @ApiProperty()
  enrollmentDate: Date;

  @ApiProperty({ description: 'Nombre de quien matricula' })
  UserName: string;

  @ApiProperty({ description: 'Direccion del matriculado ' })
  direction: string;

  @ApiProperty({ description: 'Telefono' })
  phone: string;

  @ApiProperty({ description: 'EmergenciPhone  ' })
  ePhone: string;

  @ApiProperty({ description: 'Email' })
  email: string;

}
