/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { NewAttendanceDTO } from './DTO';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Asistencia")
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async addBookChildren(
    @Body() newAttendance: NewAttendanceDTO,
  ): Promise<{ message: string }> {
    return this.attendanceService.newAttendance(newAttendance);
  }
}
