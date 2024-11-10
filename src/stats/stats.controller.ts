/* eslint-disable prettier/prettier */
import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';
import { StatsDto } from './dto/StatsDto';

@ApiTags("stats")
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getMonthlyStats(): Promise<StatsDto[]> {
    return this.statsService.getStats();
  }
}