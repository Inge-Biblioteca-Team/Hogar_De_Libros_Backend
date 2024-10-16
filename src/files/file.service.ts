/* eslint-disable prettier/prettier */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  saveAdviceIMG(file: Express.Multer.File): string {
    const destination = './assets/Avisos';
    if (!file.originalname) {
      throw new Error('El archivo no contiene un nombre original');
    }
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    const filePath = `${destination}/${file.originalname}`;
    fs.writeFileSync(filePath, file.buffer);
    return `http://localhost:3000/${destination}/${file.originalname}`;
  }

  //Imagenes de cursos
  saveCourseIMG(file: Express.Multer.File): string {
    const destination = './assets/Cursos';
    if (!file.originalname) {
      throw new Error('El archivo no contiene un nombre original');
    }
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    const filePath = `${destination}/${file.originalname}`;
    fs.writeFileSync(filePath, file.buffer);
    return `http://localhost:3000/${destination}/${file.originalname}`;
  }

  //de eventos
  saveEventIMG(file: Express.Multer.File): string {
    const destination = './assets/Eventos';
    if (!file.originalname) {
      throw new Error('El archivo no contiene un nombre original');
    }
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    const filePath = `${destination}/${file.originalname}`;
    fs.writeFileSync(filePath, file.buffer);
    return `http://localhost:3000/${destination}/${file.originalname}`;
  }

  //Salas
  saveRoomsIMG(file: Express.Multer.File): string {
    const destination = './assets/Salas';
    if (!file.originalname) {
      throw new Error('El archivo no contiene un nombre original');
    }
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    const filePath = `${destination}/${file.originalname}`;
    fs.writeFileSync(filePath, file.buffer);
    return `http://localhost:3000/${destination}/${file.originalname}`;
  }
  //Libros de niños
  saveBookChildrenIMG(file: Express.Multer.File): string {
    const destination = './assets/Libro_Infantil';
    if (!file.originalname) {
      throw new Error('El archivo no contiene un nombre original');
    }
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    const filePath = `${destination}/${file.originalname}`;
    fs.writeFileSync(filePath, file.buffer);
    return `http://localhost:3000/${destination}/${file.originalname}`;
  }
  // Libros del catalogo general
  saveBooksIMG(file: Express.Multer.File): string {
    const destination = './assets/Libros';
    if (!file.originalname) {
      throw new Error('El archivo no contiene un nombre original');
    }
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    const filePath = `${destination}/${file.originalname}`;
    fs.writeFileSync(filePath, file.buffer);
    return `http://localhost:3000/${destination}/${file.originalname}`;
  }
  //Artistas Locales
  saveArtistIMG(file: Express.Multer.File): string {
    const destination = './assets/Artistas';
    if (!file.originalname) {
      throw new Error('El archivo no contiene un nombre original');
    }
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    const filePath = `${destination}/${file.originalname}`;
    fs.writeFileSync(filePath, file.buffer);
    return `http://localhost:3000/${destination}/${file.originalname}`;
  }
  // Programas
  saveProgramsIMG(file: Express.Multer.File): string {
    const destination = './assets/Programas';
    if (!file.originalname) {
      throw new Error('El archivo no contiene un nombre original');
    }
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    const filePath = `${destination}/${file.originalname}`;
    fs.writeFileSync(filePath, file.buffer);
    return `http://localhost:3000/${destination}/${file.originalname}`;
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
      return files.map(
        (file) => `http://localhost:3000/assets/${category}/${file}`,
      );
    } catch (error) {
      console.error('Error leyendo la carpeta:', error);
      throw new InternalServerErrorException(
        'Error al leer la carpeta o generar las URLs',
      );
    }
  }
}
