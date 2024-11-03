/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ComputersController } from './computers.controller';
import { ComputersService } from './computers.service';
import { Computer } from './computer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkStationsModule } from 'src/work-stations/work-stations.module';

@Module({
  imports:[TypeOrmModule.forFeature([Computer]), WorkStationsModule],
  controllers: [ComputersController],
  providers: [ComputersService],
  exports: [ComputersService],
})
export class ComputersModule {}
