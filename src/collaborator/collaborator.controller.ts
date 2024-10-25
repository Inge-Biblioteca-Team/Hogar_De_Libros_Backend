/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateCollaboratorDTO } from './DTO/create-collaborator-DTO';
import { GetAllCollaboratorFilterDTO } from './DTO/get-filter-collaborator-DTO';
import { ApiTags } from '@nestjs/swagger';
import { DenyCollaboratorRequestDTO } from './DTO/deny-collaborator-DTO';

@ApiTags('collaborator')
@Controller('collaborator')
export class CollaboratorController {
  constructor(private collaboratorService: CollaboratorService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async CreateCollaborator(
    @Body() dto: CreateCollaboratorDTO,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<{ message: string }> {
    const documents = files || [];

    return this.collaboratorService.CreateCollaborator(dto, documents);
  }

  @Get()
  async getAllCollaborator(
    @Query(ValidationPipe) filterDTO: GetAllCollaboratorFilterDTO,
  ) {
    return await this.collaboratorService.getAllCollaborator(filterDTO);
  }

  @Patch('aproveCollaborator/:CollaboratorId')
  async aproveCollaborator(
    @Param('CollaboratorId') CollaboratorId: number,
  ): Promise<{ message: string }> {
    return this.collaboratorService.aproveCollaborator(CollaboratorId);
  }

  @Patch('denyCollaborator/:id')
  async denyCollaborator(
    @Param('id') CollaboratorId: number,
    @Body() dto: DenyCollaboratorRequestDTO,
  ): Promise<{ message: string }> {
    return this.collaboratorService.denyCollaborator(CollaboratorId, dto);
  }

  @Patch('cancelCollaborator/:id')
  async canelCollaborator(
    @Param('id') CollaboratorId: number,
    @Body() dto: DenyCollaboratorRequestDTO,
  ): Promise<{ message: string }> {
    return this.collaboratorService.CancelCollaborator(CollaboratorId, dto);
  }
}
