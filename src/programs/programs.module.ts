import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { ProgramsController } from './programs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Programs } from './programs.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Programs])],
  providers: [ProgramsService],
  controllers: [ProgramsController],
  exports: [TypeOrmModule]
})
export class ProgramsModule {}
