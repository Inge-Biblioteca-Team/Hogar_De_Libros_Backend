import { forwardRef, Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { ProgramsModule } from 'src/programs/programs.module';

@Module({
  imports:[
    ProgramsModule,
    forwardRef(() => EnrollmentModule),
    TypeOrmModule.forFeature([Course])],
  providers: [CourseService],
  controllers: [CourseController],
  exports:[TypeOrmModule, CourseService]
})
export class CourseModule {}
