/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDTO } from './DTO/create-donation-DTO';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { GetFilterDonationDTO } from './DTO/get-filter-donation-DTO';
import { ApiTags } from '@nestjs/swagger';
import { DenyDonationRequestDTO } from './DTO/deny-donation-DTO';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';


@ApiTags('Donation')
@Controller('donation')
export class DonationController {
  constructor(private donationService: DonationService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async CreateDonation(
    @Body() dto: CreateDonationDTO,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<{ message: string }> {
    const documents = files || [];

    return this.donationService.CreateDonation(dto, documents);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin','asistente')
  async getAllDonation(@Query(ValidationPipe) filterDTO: GetFilterDonationDTO) {
    return await this.donationService.getAllDonation(filterDTO);
  }

  @Patch('aproveFriendDonation/:DonationID')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async aproveDonation(
    @Param('DonationID') DonationID: number,
  ): Promise<{ message: string }> {
    return this.donationService.aproveDonation(DonationID);
  }

  @Patch('denyDonation/:DonationID')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async denyDonation(
    @Param('DonationID') DonationID: number,
    @Body() DTO: DenyDonationRequestDTO,
  ): Promise<{ message: string }> {
    return this.donationService.denyDonation(DonationID, DTO);
  }

  @Patch('confirmDonation/:DonationID')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async confirmDonation(
    @Param('DonationID') DonationID: number,
    @Body() DTO: DenyDonationRequestDTO,
  ): Promise<{ message: string }> {
    return this.donationService.confirmDonation(DonationID, DTO);
  }
}
