import { Module } from '@nestjs/common';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from 'src/notes/notes.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Donation } from './donation.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donation, User]),
    NotesModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  ],
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule {}
