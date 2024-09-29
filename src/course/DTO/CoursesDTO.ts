/* eslint-disable prettier/prettier */

import { IsDate, IsNumber, IsString } from 'class-validator';

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
  @IsString()
  Status: string;
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
