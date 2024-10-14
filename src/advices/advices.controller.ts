/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AdvicesService } from './advices.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAdviceDto } from './dto/create-advice.dto';
import { UpdateAdviceDto } from './dto/update-advice.dto';
import { Paginacion_AdviceDTO } from './dto/Paginacion-Advice.dto';
import { Advice } from './entities/advice.entity';

@ApiTags('Avisos Importantes')
@Controller('advices')
export class AdvicesController {
  constructor(private readonly advicesService: AdvicesService) {}

  @Post()
  async createAdvice(
    @Body() Dto: CreateAdviceDto,
  ): Promise<{ message: string }> {
    return this.advicesService.createNewAdvice(Dto);
  }

  @Patch('/:id')
  async editAdvice(
    @Body() Dto: UpdateAdviceDto,
    @Param('id') id: number,
  ): Promise<{ message: string }> {
    return this.advicesService.editAdvice(Dto, id);
  }

  @Delete('/:id')
  async deleteAdvice(@Param('id') id: number): Promise<{ message: string }> {
    return this.advicesService.deleteAdvice(id);
  }

  @Get()
  async getAdvice(
    @Query() params: Paginacion_AdviceDTO,
  ): Promise<{ data: Advice[]; count: number }> {
    return this.advicesService.getAdvice(params);
  }

}
