/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkStationsService } from './work-stations.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateWorkStationDto } from './dto/update-work-station.dto';
import { CreateWorkStationDto } from './dto/create-work-station.dto';

@ApiTags('work-stations')
@Controller('work-stations')
export class WorkStationsController {
  constructor(private WsService: WorkStationsService) {}

  @Get('workstation/Status')
  async getStatusWorkStation(): Promise<
    { MachineNumber: number; Status: string }[]
  > {
    return await this.WsService.getStatusWorkStation();
  }

  // PROMISE MESSAGE y dto parcial
  @Patch(':machineNumber/maintenance')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async setWorkStationToMaintenance(
    @Body() data: UpdateWorkStationDto,
  ): Promise<{ message: string }> {
    return this.WsService.SetWorkStationToMaintenance(data);
  }
  // PROMISE MESSAGE
  @Patch(':machineNumber/available')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async setWorkStationToAvailable(
    @Param('machineNumber') machineNumber: number,
  ): Promise<{ message: string }> {
    return this.WsService.ResetWorkStation(machineNumber);
  }
  // PROMISE MESSAGE
  @Patch(':machineNumber/reactive')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async ReactiveMachine(
    @Param('machineNumber') machineNumber: number,
  ): Promise<string> {
    return this.WsService.ReactiveMachine(machineNumber);
  }

  @Post()
  async createWorkStation(
    @Body() data: CreateWorkStationDto,
  ): Promise<{ message: string }> {
    return this.WsService.createWorkStation(data);
  }
}
