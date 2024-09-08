/* eslint-disable prettier/prettier */
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() file): Promise<{ filePath: string }> {
    if (!file) {
      throw new Error('No file uploaded');
    }
    const filePath = `http://localhost:3000/assets/${file.filename}`;
    return { filePath };
  }
}
