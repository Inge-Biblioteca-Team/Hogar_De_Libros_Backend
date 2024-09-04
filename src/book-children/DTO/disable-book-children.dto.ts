/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean} from "class-validator";

export class DisableBookChildrenDto {
    @ApiProperty()
    @IsBoolean()
    Status: boolean=false;
  }