import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendsLibrary } from './friend-library.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { CreateOrUpdateFriendLibraryDTO } from './DTO/create-friend-libary-DTO';

@Injectable()
export class FriendsLibraryService {
  constructor(
    @InjectRepository(FriendsLibrary)
    private FriendRepositoy: Repository<FriendsLibrary>,
    @InjectRepository(User) private UserRepository: Repository<User>,
  ) {}

  async createOrUpdateFriendLibrary(
    dto: CreateOrUpdateFriendLibraryDTO,
    documents: Express.Multer.File[], // Recibimos los archivos
  ): Promise<{ message: string }> { // Se retorna un mensaje descriptivo
    try {
      const { cedula, principalCategory, subCategory } = dto;

      const user = await this.UserRepository.findOne({ where: { cedula } });
      if (!user) {
        throw new NotFoundException(`Usuario con cédula ${cedula} no encontrado`);
      }

      let friendsLibrary = await this.FriendRepositoy.findOne({ where: { user } });

      if (!friendsLibrary) {
        
        friendsLibrary = this.FriendRepositoy.create({
          user,
          PrincipalCategory: principalCategory,
          SubCategory: subCategory,
        });

        await this.FriendRepositoy.save(friendsLibrary);

        return { message: 'Solicitud de amigo creada correctamente' }; 
      } else {
      
        friendsLibrary.PrincipalCategory = this.addUniqueData(
          friendsLibrary.PrincipalCategory,
          principalCategory,
        );

        friendsLibrary.SubCategory = this.addUniqueData(
          friendsLibrary.SubCategory,
          subCategory,
        );

        if (documents && documents.length > 0) {
          const documentPaths = documents.map((file) => file.path);
          
          friendsLibrary.Document = this.addUniqueData(friendsLibrary.Document || [], documentPaths);
        }

        await this.FriendRepositoy.save(friendsLibrary);

        return { message: 'Solicitud de amigo actualizada correctamente' };  
      }
    } catch (error) {
      throw new InternalServerErrorException({
        message: error.message || 'Error al crear o actualizar la biblioteca de amigos',
        error: error.stack, 
      });
    }
  }

  private addUniqueData(existingData: string[], newData: string[]): string[] {
    const dataSet = new Set(existingData);
    newData.forEach((data) => {
      if (!dataSet.has(data)) {
        dataSet.add(data);
      }
    });
    return Array.from(dataSet);
  }



  // provicional, no es la task es solo para ver la data del create
  async getAllFriendsLibrary() {
    return this.FriendRepositoy.find({
      relations: ['user'],
    });
  }

  async aproveFriendLibrary(cedula: string) {
    try {
      // 1. Buscar el usuario por cédula y cargar la relación con friendsLibrary
      const user = await this.UserRepository.findOne({
        where: { cedula },
        relations: ['friendsLibrary'], // Asegúrate de cargar la relación con friendsLibrary
      });
  
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
  
      // 2. Validar que el usuario tenga una biblioteca de amigos asociada
      if (!user.friendsLibrary) {
        throw new NotFoundException('No se encontró la biblioteca de amigos para este usuario');
      }
  
      // 3. Aprobar al usuario como amigo en la biblioteca
      user.friendsLibrary.status = 'A'; // Cambia el estado de la biblioteca a 'A' (aprobado)
      user.IsFriend = true; // Marcar al usuario como amigo
  
      // 4. Guardar los cambios en la biblioteca de amigos primero
      await this.FriendRepositoy.save(user.friendsLibrary);
  
      // 5. Guardar los cambios en el usuario
      await this.UserRepository.save(user); // Guardar cambios del usuario
  
      // 6. Retornar un mensaje de éxito
      return { message: 'Usuario aprobado como amigo de la biblioteca' };
  
    } catch (error) {
      // Capturar cualquier error y lanzar una excepción con un mensaje personalizado
      throw new InternalServerErrorException({
        message: error.message || 'Error al aprobar al usuario como amigo de la biblioteca',
        error: error.stack, // Incluye el stack del error en los logs para más detalles
      });
    }
  }
  
  
}
