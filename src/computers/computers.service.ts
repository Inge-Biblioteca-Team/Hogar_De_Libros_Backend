import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Computer } from './computer.entity';
import { Repository } from 'typeorm';
import { ComputerDTO } from './DTO/create-computer.dto';

@Injectable()
export class ComputersService {
  constructor(
    @InjectRepository(Computer)
    private computerRepository: Repository<Computer>,
  ) {}

  async addComputer(computerDTO: ComputerDTO){
    const newComputer = this.computerRepository.create(computerDTO);
    return this.computerRepository.save(newComputer);
  }

  async getComputers(){
    return this.computerRepository.find()
  }
}
