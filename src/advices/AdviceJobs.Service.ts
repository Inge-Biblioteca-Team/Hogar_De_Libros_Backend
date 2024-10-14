/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { AdvicesService } from './advices.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class AdviceJobs implements OnModuleInit {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly adviceService: AdvicesService,
  ) {}

  onModuleInit() {
    const updateJob = new CronJob('00 23 * * *', async () => {
      await this.adviceService.updateExpiredAdvice();
    });

    const deleteJob = new CronJob('00 23 * * 0', async () => {
      await this.adviceService.deleteExpiredAdvice();
    });

    this.schedulerRegistry.addCronJob('updateExpiredAdviceJob', updateJob);
    this.schedulerRegistry.addCronJob('deleteExpiredAdviceJob', deleteJob);

    updateJob.start();
    deleteJob.start();
  }
}
