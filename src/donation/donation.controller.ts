/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
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
    @Query('DonationID') DonationID: number,
  ): Promise<{ message: string }> {
    return this.donationService.aproveDonation(DonationID);
  }

  @Patch('denyDonation/:DonationID')
  async denyDonation(
    @Query('DonationID') DonationID: number,
  ): Promise<{ message: string }> {
    return this.donationService.denyDonation(DonationID);
  }
}
