/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.type';
import { Repository } from 'typeorm';
import { NewAttendanceDTO } from './DTO';
import { format } from '@formkit/tempo';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
  ) {}

  async newAttendance(
    attendance: NewAttendanceDTO,
  ): Promise<{ message: string }> {
    const fecha = format({
      date: new Date(),
      format: 'YYYY-MM-DD',
      tz: 'America/Costa_Rica',
    });

    const today = new Date();

    console.log(fecha);

    const existingAttendance = await this.attendanceRepo.findOne({
      where: {
        cedula: attendance.cedula,
        date: new Date(today.toDateString()),
      },
    });

    if (existingAttendance) {
      throw new ConflictException(
        'Ya se registro una asistencia con su cedula el dia de hoy.',
      );
    }

    const newAttendance = this.attendanceRepo.create(attendance);
    await this.attendanceRepo.save({ ...newAttendance, date: fecha });
    return { message: 'Exito al registrar la asistencia' };
  }
}
