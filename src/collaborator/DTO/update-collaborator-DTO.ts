/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/swagger";
import { CreateCollaboratorDTO } from "./create-collaborator-DTO";

export class UpdateCollaboratorDTO extends PartialType(CreateCollaboratorDTO) {}