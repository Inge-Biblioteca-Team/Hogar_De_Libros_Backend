/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { RoomReservation } from '../entities/room-reservation.entity';

export class UpdateRoomReservationDto extends PartialType(RoomReservation) {}
