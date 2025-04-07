/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RoomReservationService } from './room-reservation.service';
import { CreateRoomReservationDto } from './dto/create-room-reservation.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilterGetDTO } from './dto/FilterGetDTO';
import { ReservationDTO } from './dto/GetReservationsDTO';
import { Queque } from './dto/ReservationsQueque';
import { UpdateRoomReservationDto } from './dto/update-room-reservation.dto';
import { UserReservationDTO } from './dto/UserReservations';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';

@ApiTags('Reservations')
@Controller('room-reservation')
export class RoomReservationController {
  constructor(
    private readonly roomReservationService: RoomReservationService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente', 'institucional')
  create(
    @Body() createRoomReservationDto: CreateRoomReservationDto,
  ): Promise<{ message: string }> {
    return this.roomReservationService.NewReservation(createRoomReservationDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente')
  async getAllReservations(
    @Query() filter: FilterGetDTO,
  ): Promise<{ data: ReservationDTO[]; count: number }> {
    return this.roomReservationService.getAllReservations(filter);
  }

  @Get('queque')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente','institucional')
  async getQuequeReservations(
    @Query() filter: FilterGetDTO,
  ): Promise<Queque[]> {
    return this.roomReservationService.getActiveResertavions(filter);
  }

  @Patch('Aprove/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async PatchAprove(@Param('id') Id: number): Promise<{ message: string }> {
    return this.roomReservationService.aprovReservation(Id);
  }

  @Patch('End/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async PatchEnd(
    @Param('id') Id: number,
    @Body() updateReserve: UpdateRoomReservationDto,
  ): Promise<{ message: string }> {
    return this.roomReservationService.finalizeReservation(Id, updateReserve);
  }

  @Patch('Refuse/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async PatchRefuse(@Param('id') Id: number): Promise<{ message: string }> {
    return this.roomReservationService.refuseReservation(Id);
  }

  @Patch('Cancel/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async PatchCancel(@Param('id') Id: number): Promise<{ message: string }> {
    return this.roomReservationService.cencelReservation(Id);
  }

  @Get('count/:userCedula')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'asistente', 'institucional', 'external_user', 'recepcion')
  async countReservationsByCedula(
    @Param('userCedula') userCedula: string,
  ): Promise<{ count: number }> {
    return this.roomReservationService.countReservationsByCedula(userCedula);
  }

  @Get('user')
  async getAllUserReservations(
    @Query() filter: FilterGetDTO,
  ): Promise<{ data: UserReservationDTO[]; count: number }> {
    return this.roomReservationService.getAllUserReservations(filter);
  }
}
