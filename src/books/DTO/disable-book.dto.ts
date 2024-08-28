import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class DisableBookDto {
    @ApiProperty()
    @IsBoolean()
    Status: boolean=false;
  }