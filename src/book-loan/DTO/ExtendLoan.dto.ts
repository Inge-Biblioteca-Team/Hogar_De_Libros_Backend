import { ApiProperty,  } from '@nestjs/swagger';

import { IsDateString, IsNotEmpty } from 'class-validator';

export class ExtendLoanDTO {
  @ApiProperty({
    example: '2025-04-17',
    description: 'Nueva fecha de devolución',
  })
  @IsNotEmpty()
  @IsDateString()
  LoanExpirationDate: string;
}
