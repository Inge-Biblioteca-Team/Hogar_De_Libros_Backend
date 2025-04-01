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

@ApiTags('Notify')
@Controller('notes')
@UseGuards(AuthGuard, RolesGuard)
export class NotesController {
  constructor(private readonly notyService: NotesService) {}

  @Get('read')
  @Roles('admin', 'asistente')
  async getReadNotes(): Promise<{ data: Note[]; count: number }> {
    return await this.notyService.getReadNotes();
  }

  @Get('trash')
  @Roles('admin', 'asistente')
  async getTrashNotes(): Promise<{ data: Note[]; count: number }> {
    return await this.notyService.getTrashdNotes();
  }

  @Get('pending')
  @Roles('admin', 'asistente')
  async getPendingNotes(): Promise<{ data: Note[]; count: number }> {
    return await this.notyService.getPendingNotes();
  }

  @Get('Count')
  async getCountPending(): Promise<number> {
    return await this.notyService.getNotifyCount();
  }

  @Patch(':id/read')
  @Roles('admin', 'asistente')
  async markAsRead(
    @Param('id') notificationId: number,
  ): Promise<{ message: string }> {
    return await this.notyService.markAsRead(notificationId);
  }
  @Patch('read/multiple')
  @Roles('admin', 'asistente')
  async markMultipleAsRead(
    @Body('ids') notificationIds: number[],
  ): Promise<{ message: string }> {
    return await this.notyService.moveMultipleToRead(notificationIds);
  }

  @Patch(':id/trash')
  @Roles('admin', 'asistente')
  async moveToTrash(
    @Param('id') notificationId: number,
  ): Promise<{ message: string }> {
    return await this.notyService.moveToTras(notificationId);
  }

  @Patch('trash/multiple')
  @Roles('admin', 'asistente')
  async moveMultipleToTrash(
    @Body('ids') notificationIds: number[],
  ): Promise<{ message: string }> {
    return await this.notyService.moveMultipleToTrash(notificationIds);
  }

  @Delete(':id/trash')
  @Roles('admin', 'asistente')
  async deleteFromTrash(
    @Param('id') notificationId: number,
  ): Promise<{ message: string }> {
    return await this.notyService.deleteFromTrash(notificationId);
  }

  @Delete('trash/multiple')
  @Roles('admin', 'asistente')
  async deleteMultipleFromTrash(
    @Body('ids') notificationIds: number[],
  ): Promise<{ message: string }> {
    return await this.notyService.deleteMultipleFromTrash(notificationIds);
  }
  @Patch(':id/recover')
  @Roles('admin', 'asistente')
  async recoverFromTrash(
    @Param('id') notificationId: number,
  ): Promise<{ message: string }> {
    return await this.notyService.recoverFromTras(notificationId);
  }

  @Patch('trash/recover/multiple')
  @Roles('admin', 'asistente')
  async recoverMultipleFromTrash(
    @Body('ids') notificationIds: number[],
  ): Promise<{ message: string }> {
    return await this.notyService.recoveryMultiplefromTrash(notificationIds);
  }

  @Post()
  @Roles('admin', 'asistente')
  async createNote(
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<{ message: string }> {
    return await this.notyService.createNote(createNoteDto);
  }
}
