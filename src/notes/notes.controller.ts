/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './entities/note.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notify')
@Controller('notes')
export class NotesController {
  constructor(private readonly notyService: NotesService) {}

  @Get('read')
  async getReadNotes(): Promise<{ data: Note[]; count: number }> {
    return await this.notyService.getReadNotes();
  }

  @Get('trash')
  async getTrashNotes(): Promise<{ data: Note[]; count: number }> {
    return await this.notyService.getTrashdNotes();
  }

  @Get('pending')
  async getPendingNotes(): Promise<{ data: Note[]; count: number }> {
    return await this.notyService.getPendingNotes();
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: number): Promise<void> {
    return await this.notyService.markAsRead(notificationId);
  }

  @Patch(':id/trash')
  async moveToTrash(@Param('id') notificationId: number): Promise<void> {
    return await this.notyService.moveToTras(notificationId);
  }

  @Patch('trash/multiple')
  async moveMultipleToTrash(
    @Body('ids') notificationIds: number[],
  ): Promise<void> {
    return await this.notyService.moveMultipleToTrash(notificationIds);
  }

  @Delete(':id/trash')
  async deleteFromTrash(@Param('id') notificationId: number): Promise<void> {
    return await this.notyService.deleteFromTrash(notificationId);
  }

  @Delete('trash/multiple')
  async deleteMultipleFromTrash(
    @Body('ids') notificationIds: number[],
  ): Promise<void> {
    return await this.notyService.deleteMultipleFromTrash(notificationIds);
  }
  @Patch(':id/recover')
  async recoverFromTrash(@Param('id') notificationId: number): Promise<void> {
    return await this.notyService.recoverFromTras(notificationId);
  }

  @Patch('trash/recover/multiple')
  async recoverMultipleFromTrash(
    @Body('ids') notificationIds: number[],
  ): Promise<void> {
    return await this.notyService.recoveryMultiplefromTrash(notificationIds);
  }
}
