/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { CreateProgramDto } from './create-program.dto';


export class UpdateProgramsDto extends PartialType(CreateProgramDto) {}