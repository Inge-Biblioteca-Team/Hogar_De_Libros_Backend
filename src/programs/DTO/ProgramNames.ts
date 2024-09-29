/* eslint-disable prettier/prettier */
import { IsNumber, IsString } from 'class-validator';
export class ProgramsNames {
  @IsNumber()
  programsId: number;
  @IsString()
  programName: string;
}
