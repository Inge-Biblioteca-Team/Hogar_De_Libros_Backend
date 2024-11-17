/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';
import { StatsDto } from './dto/StatsDto';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getMonthlyStats(): Promise<StatsDto[]> {
    return this.statsService.getStats();
  }

  @Get('/successful-counts/current-year')
  async getSuccessfulCountsCurrentYear() {
    return this.statsService.getSuccessfulCountsCurrentYear();
  }

  @Get('/general-counts')
  async getGeneralCounts() {
    return this.statsService.getGeneralCounts();
  }

  @Get('/Week-Calendar')
  async weekCalendar(): Promise<{ title: string; date: string }[]> {
    return this.statsService.getCalendarItems();
  }
}
