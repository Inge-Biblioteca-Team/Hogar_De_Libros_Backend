/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FriendsLibraryController } from './friends-library.controller';
import { FriendsLibraryService } from './friends-library.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsLibrary } from './friend-library.entity';
import { User } from 'src/user/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { NotesModule } from 'src/notes/notes.module';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendsLibrary, User]),
    NotesModule,
    MailsModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  ],
  controllers: [FriendsLibraryController],
  providers: [FriendsLibraryService],
})
export class FriendsLibraryModule {}
