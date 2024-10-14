import { Module } from '@nestjs/common';
import { FriendsLibraryController } from './friends-library.controller';
import { FriendsLibraryService } from './friends-library.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsLibrary } from './friend-library.entity';
import { User } from 'src/user/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [TypeOrmModule.forFeature([FriendsLibrary, User]),
  MulterModule.register({
    storage: diskStorage({
      destination: './src/uploads', // Carpeta donde se guardarán los archivos
      filename: (req, file, cb) => {
        // Mantener el nombre original del archivo
        cb(null, file.originalname);
      },
    }),
  }),
],
  controllers: [FriendsLibraryController],
  providers: [FriendsLibraryService],
})
export class FriendsLibraryModule {}
