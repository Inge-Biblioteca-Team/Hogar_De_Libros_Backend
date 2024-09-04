/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/swagger";
import { CreateBookChildrenDto } from "./create-book-children.dto";

 
 export class UpdateBookChildrenDto extends PartialType(CreateBookChildrenDto){}