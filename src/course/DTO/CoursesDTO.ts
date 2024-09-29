/* eslint-disable prettier/prettier */

import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class CoursesDTO {
  @IsNumber()
  courseId: number;
  @IsString()
  courseName: string;
  @IsDate()
  date: Date;
  @IsString()
  courseTime: string;
  @IsString()
  location: string;
  @IsString()
  instructor: string;
  @IsString()
  courseType: string;
  @IsNumber()
  targetAge: number;
  @IsNumber()
  capacity: number;
  @IsBoolean()
  Status: boolean;
  @IsString()
  currentStatus: string;
  @IsString()
  image: string;
  @IsString()
  duration: string;
  @IsDate()
  endDate: Date;
  @IsString()
  programName: string;
  @IsString()
  programProgramsId: number;
}
