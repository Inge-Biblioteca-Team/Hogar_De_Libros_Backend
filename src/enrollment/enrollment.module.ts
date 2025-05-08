/* eslint-disable prettier/prettier */
import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from 'src/course/course.module';
import { UserModule } from 'src/user/user.module';
import { Enrollment } from './enrollment.entity';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  imports:[
    UserModule,
    MailsModule,
    forwardRef(() => CourseModule),
    TypeOrmModule.forFeature([Enrollment])],
  providers: [EnrollmentService],
  controllers: [EnrollmentController],
  exports:[TypeOrmModule, EnrollmentService],
})
export class EnrollmentModule {}
