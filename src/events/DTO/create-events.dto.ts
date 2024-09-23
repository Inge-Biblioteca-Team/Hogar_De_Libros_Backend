import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEventsDTO{
   
    @ApiProperty({example: 'Parque recadero Briceño'})
    @IsString()
    @IsNotEmpty()
    Location: string;

    @ApiProperty({example: 'Charla de lectura'})
    @IsString()
    @IsNotEmpty()
    Title: string;

    @ApiProperty({example: 'Evento de charla sobre la importancia de la lectura'})
    @IsString()
    @IsNotEmpty()
    Details: string;

    @ApiProperty({example: '2021-10-10'})
    @IsDate()
    @IsNotEmpty()
    Date: Date;

    @ApiProperty({example: 'URL de la imagen del evento'})
    @IsString()
    @IsNotEmpty()
    Image: string;

    @ApiProperty({example: 'Niños de 5 a 10 años'})
    @IsString()
    @IsNotEmpty()
    TargetAudience: string;

    @ApiProperty({example: 'true'})
    @IsBoolean()
    @IsNotEmpty()
    Status: boolean;
    
    @ApiProperty({example: 'Juan Perez'})
    @IsString()
    @IsNotEmpty()
    InchargePerson: string;
}