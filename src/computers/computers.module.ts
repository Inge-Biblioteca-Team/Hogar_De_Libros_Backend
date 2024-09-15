/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ComputersController } from './computers.controller';
import { ComputersService } from './computers.service';
import { Computer } from './computer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkStation } from './WorkStation.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Computer, WorkStation])],
  controllers: [ComputersController],
  providers: [ComputersService],
  exports: [ComputersService, TypeOrmModule],
})
export class ComputersModule {}
