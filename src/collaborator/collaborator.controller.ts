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
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CollaboratorService } from './collaborator.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateCollaboratorDTO } from './DTO/create-collaborator-DTO';
import { GetAllCollaboratorFilterDTO } from './DTO/get-filter-collaborator-DTO';
import { ApiTags } from '@nestjs/swagger';
import { DenyCollaboratorRequestDTO } from './DTO/deny-collaborator-DTO';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/user/user.entity';

@ApiTags('collaborator')
@Controller('collaborator')
@UseGuards(AuthGuard, RolesGuard)
export class CollaboratorController {
  constructor(private collaboratorService: CollaboratorService) {}

  @Post()
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser, Role.Reception)
  @UseInterceptors(AnyFilesInterceptor())
  async CreateCollaborator(
    @Body() dto: CreateCollaboratorDTO,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<{ message: string }> {
    const documents = files || [];

    return this.collaboratorService.CreateCollaborator(dto, documents);
  }

  @Get()
  @Roles(Role.Admin, Role.Creator)
  async getAllCollaborator(
    @Query(ValidationPipe) filterDTO: GetAllCollaboratorFilterDTO,
  ) {
    return await this.collaboratorService.getAllCollaborator(filterDTO);
  }

  @Patch('aproveCollaborator/:CollaboratorId')
  @Roles(Role.Admin)
  async aproveCollaborator(
    @Param('CollaboratorId') CollaboratorId: number,
  ): Promise<{ message: string }> {
    return this.collaboratorService.aproveCollaborator(CollaboratorId);
  }

  @Patch('denyCollaborator/:id')
  @Roles(Role.Admin)
  async denyCollaborator(
    @Param('id') CollaboratorId: number,
    @Body() dto: DenyCollaboratorRequestDTO,
  ): Promise<{ message: string }> {
    return this.collaboratorService.denyCollaborator(CollaboratorId, dto);
  }

  @Patch('cancelCollaborator/:id')
  @Roles(Role.Admin, Role.ExternalUser, Role.Creator, Role.Reception)
  async canelCollaborator(
    @Param('id') CollaboratorId: number,
    @Body() dto: DenyCollaboratorRequestDTO,
  ): Promise<{ message: string }> {
    return this.collaboratorService.CancelCollaborator(CollaboratorId, dto);
  }
}
