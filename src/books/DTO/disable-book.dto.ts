/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean} from "class-validator";

export class DisableBookDto {
    @ApiProperty()
    @IsBoolean()
    Status: boolean=false;
  }