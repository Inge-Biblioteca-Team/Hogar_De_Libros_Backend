/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookLoan } from 'src/book-loan/book-loan.entity';
import { User } from 'src/user/user.entity';
import { Collaborator } from 'src/collaborator/collaborator.entity';
import { Donation } from 'src/donation/donation.entity';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { FriendsLibrary } from 'src/friends-library/friend-library.entity';
import { RoomReservation } from 'src/room-reservation/entities/room-reservation.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { MailCronService } from './mail-cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookLoan, User, Collaborator, FriendsLibrary, 
    Donation, Enrollment, RoomReservation]), ScheduleModule.forRoot()],
  providers: [MailsService,MailCronService],
  exports: [MailsService],
})
export class MailsModule {}


