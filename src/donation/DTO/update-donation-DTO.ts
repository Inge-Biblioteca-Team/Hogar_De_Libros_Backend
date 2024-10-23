import { PartialType } from "@nestjs/swagger";
import { CreateDonationDTO } from "./create-donation-DTO";

export class UpdateDonationDTO extends PartialType(CreateDonationDTO) {}