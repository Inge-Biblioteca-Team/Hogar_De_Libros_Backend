/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { LocalArtistService } from './local-artist.service';
import { LocalArtistController } from './local-artist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalArtist } from './local-artist.entity';

@Module({
  imports:[TypeOrmModule.forFeature([LocalArtist])],
  controllers: [LocalArtistController],
  providers: [LocalArtistService],
})
export class LocalArtistModule {}
