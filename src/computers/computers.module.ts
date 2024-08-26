import { Module } from '@nestjs/common';
import { ComputersController } from './computers.controller';
import { ComputersService } from './computers.service';
import { Computer } from './computer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Computer])],
  controllers: [ComputersController],
  providers: [ComputersService]
})
export class ComputersModule {}
