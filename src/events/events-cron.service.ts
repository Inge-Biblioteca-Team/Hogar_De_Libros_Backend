/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EventsService } from './events.service';

@Injectable()
export class EventsCronService implements OnModuleInit {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,

    private readonly eventService: EventsService,
  ) {}

  async onModuleInit() {
    const updateJob = new CronJob('7 10 * * *', async () => {
      await this.eventService.updateExpireEvent();
    });

    this.schedulerRegistry.addCronJob('updateEventStatusJob', updateJob);

    updateJob.start();
  }
}
