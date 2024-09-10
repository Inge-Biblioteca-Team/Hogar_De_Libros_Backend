/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FurnitureService } from './furniture.service';
import { FurnitureController } from './furniture.controller';

@Module({
  controllers: [FurnitureController],
  providers: [FurnitureService],
})
export class FurnitureModule {}
