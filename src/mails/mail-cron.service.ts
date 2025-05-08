/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MailsService } from './mails.service';

@Injectable()
export class MailCronService implements OnModuleInit {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,

    private readonly mailService: MailsService,
  ) {}

  async onModuleInit() {
    const loanAlerts = new CronJob('0 8 * * 1', async () => {
      await this.mailService.loanMemo();
    });
    loanAlerts.start();
    this.schedulerRegistry.addCronJob('LoansAlerts', loanAlerts);

    loanAlerts.start();
  }
}
