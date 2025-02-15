/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WorkStationsService } from './work-stations.service';
import { WorkStationsController } from './work-stations.controller';
import { WorkStation } from './entities/work-station.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports:[TypeOrmModule.forFeature([WorkStation])],
  controllers: [WorkStationsController],
  providers: [WorkStationsService],
  exports:[WorkStationsService]
})
export class WorkStationsModule {}

