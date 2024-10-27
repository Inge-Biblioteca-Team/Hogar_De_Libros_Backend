/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class UploadFileDTO{


    @ApiProperty({description:"Archivo de imagen a cargar"})
    @IsNotEmpty({message: "Debe adjuntar un archivo."})
    image:File

    @ApiProperty({description:"Path de la carpeta objetivo"})
    @IsString()
    path:string

}