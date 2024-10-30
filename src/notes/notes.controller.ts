/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateNoteDto } from './dto/create-note.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/user/user.entity';

@ApiTags('Notify')
@Controller('notes')
@UseGuards(AuthGuard, RolesGuard)
export class NotesController {
  constructor(private readonly notyService: NotesService) {}

  @Get('read')
  @Roles(Role.Admin)
  async getReadNotes(): Promise<{ data: Note[]; count: number }> {
    return await this.notyService.getReadNotes();
  }

  @Get('trash')
  @Roles(Role.Admin)
  async getTrashNotes(): Promise<{ data: Note[]; count: number }> {
    return await this.notyService.getTrashdNotes();
  }

  @Get('pending')
  @Roles(Role.Admin)
  async getPendingNotes(): Promise<{ data: Note[]; count: number }> {
    return await this.notyService.getPendingNotes();
  }

  @Patch(':id/read')
  @Roles(Role.Admin)
  async markAsRead(
    @Param('id') notificationId: number,
  ): Promise<{ message: string }> {
    return await this.notyService.markAsRead(notificationId);
  }
  @Patch('read/multiple')
  @Roles(Role.Admin)
  async markMultipleAsRead(
    @Body('ids') notificationIds: number[],
  ): Promise<{ message: string }> {
    return await this.notyService.moveMultipleToRead(notificationIds);
  }

  @Patch(':id/trash')
  @Roles(Role.Admin)
  async moveToTrash(
    @Param('id') notificationId: number,
  ): Promise<{ message: string }> {
    return await this.notyService.moveToTras(notificationId);
  }

  @Patch('trash/multiple')
  @Roles(Role.Admin)
  async moveMultipleToTrash(
    @Body('ids') notificationIds: number[],
  ): Promise<{ message: string }> {
    return await this.notyService.moveMultipleToTrash(notificationIds);
  }

  @Delete(':id/trash')
  @Roles(Role.Admin)
  async deleteFromTrash(
    @Param('id') notificationId: number,
  ): Promise<{ message: string }> {
    return await this.notyService.deleteFromTrash(notificationId);
  }

  @Delete('trash/multiple')
  @Roles(Role.Admin)
  async deleteMultipleFromTrash(
    @Body('ids') notificationIds: number[],
  ): Promise<{ message: string }> {
    return await this.notyService.deleteMultipleFromTrash(notificationIds);
  }
  @Patch(':id/recover')
  @Roles(Role.Admin)
  async recoverFromTrash(
    @Param('id') notificationId: number,
  ): Promise<{ message: string }> {
    return await this.notyService.recoverFromTras(notificationId);
  }

  @Patch('trash/recover/multiple')
  @Roles(Role.Admin)
  async recoverMultipleFromTrash(
    @Body('ids') notificationIds: number[],
  ): Promise<{ message: string }> {
    return await this.notyService.recoveryMultiplefromTrash(notificationIds);
  }

  @Post()
  @Roles(Role.Admin)
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<{ message: string }> {
    return await this.notyService.createNote(createNoteDto);
  }
}
