/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rooms } from './entities/room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rooms]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [ TypeOrmModule,RoomsService],
})
export class RoomsModule {}