/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { ProgramsModule } from 'src/programs/programs.module';
import { AdvicesModule } from 'src/advices/advices.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CourseJobs } from './Job.Service';

@Module({
  imports: [
    ProgramsModule,
    forwardRef(() => EnrollmentModule),
    TypeOrmModule.forFeature([Course]),
    AdvicesModule,
    ScheduleModule.forRoot(),
  ],
  providers: [CourseService, CourseJobs],
  controllers: [CourseController],
  exports: [TypeOrmModule, CourseService],
})
export class CourseModule {}
