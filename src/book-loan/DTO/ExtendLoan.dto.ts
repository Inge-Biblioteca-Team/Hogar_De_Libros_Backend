/* eslint-disable prettier/prettier */
import { ApiProperty,  } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class ExtendLoanDTO {
  @ApiProperty({
    example: '2025-04-17',
    description: 'Nueva fecha de devolución',
  })
  @IsNotEmpty()
  LoanExpirationDate: string;

  @ApiProperty()
  @IsString()
  Reason:string
}
