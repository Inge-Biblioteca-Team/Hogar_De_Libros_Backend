/* eslint-disable prettier/prettier */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NotesService } from './notes.service';
import { CronJob } from 'cron';

@Injectable()
export class NotesJobs implements OnModuleInit {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly notyService: NotesService,
  ) {}

  onModuleInit() {
    const deleteNotyJob = new CronJob('00 23 * * *', async () => {
      await this.notyService.deleteExpiredNotifications();
    });

    this.schedulerRegistry.addCronJob('deleteExpiredNotyJob', deleteNotyJob);

    deleteNotyJob.start();
  }
}
