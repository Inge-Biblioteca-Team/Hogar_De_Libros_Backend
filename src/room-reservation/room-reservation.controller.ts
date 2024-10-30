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
import { Role } from 'src/user/user.entity';

@ApiTags('Reservations')
@Controller('room-reservation')
@UseGuards(AuthGuard, RolesGuard)
export class RoomReservationController {
  constructor(
    private readonly roomReservationService: RoomReservationService,
  ) {}

  @Post()
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser)
  create(
    @Body() createRoomReservationDto: CreateRoomReservationDto,
  ): Promise<{ message: string }> {
    return this.roomReservationService.NewReservation(createRoomReservationDto);
  }

  @Get()
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser)
  async getAllReservations(
    @Query() filter: FilterGetDTO,
  ): Promise<{ data: ReservationDTO[]; count: number }> {
    return this.roomReservationService.getAllReservations(filter);
  }

  @Get('queque')
  @Roles(Role.Admin, Role.Creator)
  async getQuequeReservations(
    @Query() filter: FilterGetDTO,
  ): Promise<Queque[]> {
    return this.roomReservationService.getActiveResertavions(filter);
  }
  @Patch('Aprove/:id')
  @Roles(Role.Admin)
  async PatchAprove(@Param('id') Id: number): Promise<{ message: string }> {
    return this.roomReservationService.aprovReservation(Id);
  }
  @Patch('End/:id')
  @Roles(Role.Admin)
  async PatchEnd(
    @Param('id') Id: number,
    @Body() updateReserve: UpdateRoomReservationDto,
  ): Promise<{ message: string }> {
    return this.roomReservationService.finalizeReservation(Id, updateReserve);
  }
  @Patch('Refuse/:id')
  @Roles(Role.Admin)
  async PatchRefuse(@Param('id') Id: number): Promise<{ message: string }> {
    return this.roomReservationService.refuseReservation(Id);
  }
  @Patch('Cancel/:id')
  @Roles(Role.Admin)
  async PatchCancel(@Param('id') Id: number): Promise<{ message: string }> {
    return this.roomReservationService.cencelReservation(Id);
  }

  @Get('count/:userCedula')
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser)
  async countReservationsByCedula(
    @Param('userCedula') userCedula: string,
  ): Promise<{ count: number }> {
    const count =
      await this.roomReservationService.countReservationsByCedula(userCedula);
    return { count };
  }

  @Get('user')
  @Roles(Role.Admin, Role.Creator, Role.ExternalUser)
  async getAllUserReservations(
    @Query() filter: FilterGetDTO,
  ): Promise<{ data: UserReservationDTO[]; count: number }> {
    return this.roomReservationService.getAllUserReservations(filter);
  }
}
