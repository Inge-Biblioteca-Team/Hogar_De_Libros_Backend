import { Module } from '@nestjs/common';
import { CollaboratorController } from './collaborator.controller';
import { CollaboratorService } from './collaborator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from 'src/notes/notes.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { User } from 'src/user/user.entity';
import { Collaborator } from './collaborator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Collaborator, User]),
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
  controllers: [CollaboratorController],
  providers: [CollaboratorService]
})
export class CollaboratorModule {}
