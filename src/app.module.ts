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
import { ReportModule } from './Reports/Reports.Module';
import { AttendanceModule } from './attendance/attendance.module';
import { MailsModule } from './mails/mails.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql',
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USERNAME || 'user',
      password: process.env.DB_PASSWORD || 'userpassword',
      database: process.env.DB_DATABASE || 'hogar_de_libros_db',
      autoLoadEntities: true,
      synchronize: false,
      retryAttempts: 5, // Reintenta 5 veces
      retryDelay: 5000, // Espera 5 segundos entre intentos
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
    ReportModule,
    AttendanceModule,
    MailsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
