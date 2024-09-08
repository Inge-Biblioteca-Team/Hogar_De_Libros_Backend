/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './assets',
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}${extname(file.originalname)}`;
          callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [FilesController],
})
export class FilesModule {}
