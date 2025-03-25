/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.type';
import { Repository } from 'typeorm';
import { NewAttendanceDTO } from './DTO';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepo: Repository<Attendance>,
  ) {}

  async newAttendance(
    attendance: NewAttendanceDTO,
  ): Promise<{ message: string }> {
    const today = new Date();

    console.log(today)

    const existingAttendance = await this.attendanceRepo.findOne({
      where: {
        cedula: attendance.cedula,
        date: new Date(today.toDateString()),
      },
    });

    if (existingAttendance) {
      throw new ConflictException(
        'Ya se registro una asistencia con su cedula.',
      );
    }

    const newAttendance = this.attendanceRepo.create(attendance);
    await this.attendanceRepo.save({ ...newAttendance, date: new Date() });
    return { message: 'Exito al registrar la asistencia' };
  }
}
