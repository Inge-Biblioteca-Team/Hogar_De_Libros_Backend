import { PartialType } from '@nestjs/swagger';
import { CreateRoomReservationDto } from './create-room-reservation.dto';

export class UpdateRoomReservationDto extends PartialType(CreateRoomReservationDto) {}
