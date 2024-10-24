/* eslint-disable prettier/prettier */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CourseService } from './course.service';

@Injectable()
export class CourseJobs implements OnModuleInit {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly courseService: CourseService,
  ) {}

  onModuleInit() {
    const updateCoursesJob = new CronJob('30 23 * * *', async () => {
      await this.courseService.updateExpireCourses();
    });

    this.schedulerRegistry.addCronJob(
      'updateExpiredCoursesJob',
      updateCoursesJob,
    );

    updateCoursesJob.start();
  }
}
