/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), ScheduleModule.forRoot()],
  controllers: [NotesController],
  providers: [NotesService, NotesService],
  exports: [NotesService],
})
export class NotesModule {}
