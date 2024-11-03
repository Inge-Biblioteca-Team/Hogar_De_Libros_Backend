/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/book.entity';
import { Computer } from './computers/computer.entity';
import { ComputersModule } from './computers/computers.module';
import { BookLoanModule } from './book-loan/book-loan.module';
import { UserModule } from './user/user.module';
import { ComputerLoanModule } from './computer-loan/computer-loan.module';
import { BookLoan } from './book-loan/book-loan.entity';
import { ComputerLoan } from './computer-loan/computer-loan.entity';
import { User } from './user/user.entity';
import { BookChildrenModule } from './book-children/book-children.module';
import * as dotenv from 'dotenv';
import { BooksChildren } from './book-children/book-children.entity';
import { FilesModule } from './files/files.module';
import { LocalArtist } from './local-artist/local-artist.entity';
import { Furniture } from './furniture/furniture.entity';
import { LocalArtistModule } from './local-artist/local-artist.module';
import { FurnitureModule } from './furniture/furniture.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ProgramsModule } from './programs/programs.module';
import { Enrollment } from './enrollment/enrollment.entity';
import { Course } from './course/course.entity';
import { EventsModule } from './events/events.module';
import { Programs } from './programs/programs.entity';
import { RoomsModule } from './rooms/rooms.module';
import { RoomReservationModule } from './room-reservation/room-reservation.module';
import { Rooms } from './rooms/entities/room.entity';
import { RoomReservation } from './room-reservation/entities/room-reservation.entity';
import { AdvicesModule } from './advices/advices.module';
import { Advice } from './advices/entities/advice.entity';
import { events } from './events/events.entity';
import { FriendsLibraryModule } from './friends-library/friends-library.module';
import { FriendsLibrary } from './friends-library/friend-library.entity';
import { NotesModule } from './notes/notes.module';
import { Note } from './notes/entities/note.entity';
import { Donation } from './donation/donation.entity';
import { Collaborator } from './collaborator/collaborator.entity';
import { DonationModule } from './donation/donation.module';
import { CollaboratorModule } from './collaborator/collaborator.module';
import { WorkStationsModule } from './work-stations/work-stations.module';
import { WorkStation } from './work-stations/entities/work-station.entity';

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
      entities: [
        Book,
        Computer,
        BookLoan,
        ComputerLoan,
        User,
        BooksChildren,
        LocalArtist,
        Furniture,
        WorkStation,
        Enrollment,
        Course,
        events,
        Programs,
        Rooms,
        RoomReservation,
        Advice,
        FriendsLibrary,
        Note,
        Donation,
        Collaborator
      ],
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
    WorkStationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
