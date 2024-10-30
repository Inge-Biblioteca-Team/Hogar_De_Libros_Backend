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
  UseGuards,
} from '@nestjs/common';
import { AdvicesService } from './advices.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAdviceDto } from './dto/create-advice.dto';
import { UpdateAdviceDto } from './dto/update-advice.dto';
import { Paginacion_AdviceDTO } from './dto/Paginacion-Advice.dto';
import { Advice } from './entities/advice.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Role } from 'src/user/user.entity';

@ApiTags('Avisos Importantes')
@Controller('advices')
@UseGuards(AuthGuard, RolesGuard)
export class AdvicesController {
  constructor(private readonly advicesService: AdvicesService) {}

  @Post()
  @Roles(Role.Admin, Role.Creator)
  async createAdvice(
    @Body() Dto: CreateAdviceDto,
  ): Promise<{ message: string }> {
    return this.advicesService.createNewAdvice(Dto);
  }

  @Patch('/:id')
  @Roles(Role.Admin , Role.Creator)
  async editAdvice(
    @Body() Dto: UpdateAdviceDto,
    @Param('id') id: number,
  ): Promise<{ message: string }> {
    return this.advicesService.editAdvice(Dto, id);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async deleteAdvice(@Param('id') id: number): Promise<{ message: string }> {
    return this.advicesService.deleteAdvice(id);
  }

  @Get()
  @Roles(Role.Admin , Role.Creator, Role.ExternalUser, Role.Reception)
  async getAdvice(
    @Query() params: Paginacion_AdviceDTO,
  ): Promise<{ data: Advice[]; count: number }> {
    return this.advicesService.getAdvice(params);
  }

}
