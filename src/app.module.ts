/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComputersModule } from './computers/computers.module';
import { BookLoanModule } from './book-loan/book-loan.module';
import { UserModule } from './user/user.module';
import { ComputerLoanModule } from './computer-loan/computer-loan.module';
import { BookChildrenModule } from './book-children/book-children.module';
import * as dotenv from 'dotenv';
import { FilesModule } from './files/files.module';
import { LocalArtistModule } from './local-artist/local-artist.module';
import { FurnitureModule } from './furniture/furniture.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ProgramsModule } from './programs/programs.module';
import { EventsModule } from './events/events.module';
import { RoomsModule } from './rooms/rooms.module';
import { RoomReservationModule } from './room-reservation/room-reservation.module';
import { AdvicesModule } from './advices/advices.module';
import { FriendsLibraryModule } from './friends-library/friends-library.module';
import { NotesModule } from './notes/notes.module';
import { DonationModule } from './donation/donation.module';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { WorkStationsModule } from './work-stations/work-stations.module';
import { StatsModule } from './stats/stats.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    BooksModule,
    ComputersModule,
    BookLoanModule,
    UserModule,
    ComputerLoanModule,
    BookChildrenModule,
    FilesModule,
    LocalArtistModule,
    FurnitureModule,
    AuthModule,
    CourseModule,
    EnrollmentModule,
    ProgramsModule,
    EventsModule,
    RoomsModule,
    RoomReservationModule,
    AdvicesModule,
    FriendsLibraryModule,
    NotesModule,
    DonationModule,
    CollaboratorModule,
    WorkStationsModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
