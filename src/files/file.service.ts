/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();
// CAMBIAR URL DEL GET IMAGE A URL BASE del .env
@Injectable()
export class FilesService {
  SaveImage(file: Express.Multer.File, path: string): string {
    const baseUrl = process.env.BASE_URL;
    const destination = `./assets/${path}`;
    if (!file.originalname) {
      throw new Error('El archivo no contiene un nombre original');
    }
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    const filePath = `${destination}/${file.originalname}`;
    fs.writeFileSync(filePath, file.buffer);
    return `${baseUrl}/${destination}/${file.originalname}`;
  }

  //Imagen unica, Posiblemente no se use
  getImageUrl(category: string, fileName: string): string {
    const filePath = path.join('./assets', category, fileName);

    if (fs.existsSync(filePath)) {
      return `http://localhost:3000/assets/${category}/${fileName}`;
    } else {
      throw new NotFoundException('Archivos no encontrados');
    }
  }

  //Galeria por carpeta
  getAllImagesInCategory(category: string): string[] {
    const baseUrl = process.env.BASE_URL;
    const directoryPath = path.join('./assets', category);

    try {
      if (!fs.existsSync(directoryPath)) {
        throw new NotFoundException(`La carpeta ${category} no fue encontrada`);
      }
      const files = fs.readdirSync(directoryPath);
      if (files.length === 0) {
        throw new NotFoundException(
          `No se encontraron archivos en la carpeta ${category}`,
        );
      }
      return files.map((file) => `${baseUrl}/assets/${category}/${file}`);
    } catch (error) {
      console.error('Error leyendo la carpeta:', error);
      throw new InternalServerErrorException(
        'Error al leer la carpeta o generar las URLs',
      );
    }
  }
}
