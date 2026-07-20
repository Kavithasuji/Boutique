import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { JwtCustomerGuard } from "../customer-auth/guards/jwt-customer.guard";

@Controller("addresses")
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
  ) {}

  // Create Address
  @UseGuards(JwtCustomerGuard)
  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateAddressDto,
  ) {
    return this.addressService.create(
      req.user.id,
      dto,
    );
  }

  // Get Logged-in User Addresses
  @UseGuards(JwtCustomerGuard)
  @Get()
  findAll(
    @Req() req: any,
  ) {
    return this.addressService.findAll(
      req.user.id,
    );
  }
}