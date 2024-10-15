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

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.filesService.saveAdviceIMG(file);
    return { filePath };
  }

  @Post('upload/Advice')
  @UseInterceptors(FileInterceptor('image'))
  uploadAdviceImage(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.filesService.saveAdviceIMG(file);
    return { filePath };
  }
  @Post('upload/Artists')
  @UseInterceptors(FileInterceptor('image'))
  uploadArtistImages(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.filesService.saveArtistIMG(file);
    return { filePath };
  }

  @Post('upload/Artists')
  @UseInterceptors(FileInterceptor('image'))
  uploadBooksCImages(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.filesService.saveBookChildrenIMG(file);
    return { filePath };
  }

  @Post('upload/Artists')
  @UseInterceptors(FileInterceptor('image'))
  uploadBooksmages(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.filesService.saveBooksIMG(file);
    return { filePath };
  }

  @Post('upload/Rooms')
  @UseInterceptors(FileInterceptor('image'))
  uploadRoomImages(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.filesService.saveRoomsIMG(file);
    return { filePath };
  }

  @Post('upload/Programs')
  @UseInterceptors(FileInterceptor('image'))
  uploadProgramsImages(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.filesService.saveProgramsIMG(file);
    return { filePath };
  }

  @Post('upload/Courses')
  @UseInterceptors(FileInterceptor('image'))
  uploadCourseImages(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.filesService.saveCourseIMG(file);
    return { filePath };
  }

  @Post('upload/Events')
  @UseInterceptors(FileInterceptor('image'))
  uploadEventsImages(@UploadedFile() file: Express.Multer.File) {
    const filePath = this.filesService.saveEventIMG(file);
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
