/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FurnitureService } from './furniture.service';
import { FurnitureController } from './furniture.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Furniture } from './furniture.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Furniture])],
  controllers: [FurnitureController],
  providers: [FurnitureService],
})
export class FurnitureModule {}
