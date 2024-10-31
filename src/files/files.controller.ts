/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './file.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';

@ApiTags('Archivos')
@Controller('files')
@UseGuards(AuthGuard, RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/:Objetive')
  @Roles('Admin', 'Asistente','Recepcion','Externo','Institucional')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Param('Objetive') path:string) {
    const filePath = this.filesService.SaveImage(file, path);
    return { filePath };
  }

 
  @Get(':category/:fileName')
  @Roles('Admin', 'Asistente','Recepcion','Externo','Institucional')
  getFileUrl(
    @Param('category') category: string,
    @Param('fileName') fileName: string,
  ) {
    return this.filesService.getImageUrl(category, fileName);
  }

  @Get(':category')
  @Roles('Admin', 'Asistente','Recepcion','Externo','Institucional')
  getAllFilesInCategory(@Param('category') category: string) {
    return this.filesService.getAllImagesInCategory(category);
  }
}
