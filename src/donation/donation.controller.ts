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
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { CreateDonationDTO } from './DTO/create-donation-DTO';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { GetFilterDonationDTO } from './DTO/get-filter-donation-DTO';
import { ApiTags } from '@nestjs/swagger';
import { DenyDonationRequestDTO } from './DTO/deny-donation-DTO';

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
  async getAllDonation(@Query(ValidationPipe) filterDTO: GetFilterDonationDTO) {
    return await this.donationService.getAllDonation(filterDTO);
  }

  @Patch('aproveFriendDonation/:DonationID')
  async aproveDonation(
    @Param('DonationID') DonationID: number,
  ): Promise<{ message: string }> {
    return this.donationService.aproveDonation(DonationID);
  }

  @Patch('denyDonation/:DonationID')
  async denyDonation(
    @Param('DonationID') DonationID: number,
    @Body() DTO: DenyDonationRequestDTO,
  ): Promise<{ message: string }> {
    return this.donationService.denyDonation(DonationID, DTO);
  }

  @Patch('confirmDonation/:DonationID')
  async confirmDonation(
    @Param('DonationID') DonationID: number,
    @Body() DTO: DenyDonationRequestDTO,
  ): Promise<{ message: string }> {
    return this.donationService.confirmDonation(DonationID, DTO);
  }
}
