/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './file.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Archivos')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/:Objetive')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Param('Objetive') path:string) {
    const filePath = this.filesService.SaveImage(file, path);
    return { filePath };
  }

 
  @Get(':category/:fileName')
  getFileUrl(
    @Param('category') category: string,
    @Param('fileName') fileName: string,
  ) {
    return this.filesService.getImageUrl(category, fileName);
  }

  @Get(':category')
  getAllFilesInCategory(@Param('category') category: string) {
    return this.filesService.getAllImagesInCategory(category);
  }
}
