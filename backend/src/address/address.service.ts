import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAddressDto } from "./dto/create-address.dto";

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  // Create Address
  async create(userId: string, dto: CreateAddressDto) {
    // If this address is default,
    // remove default from all existing addresses
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: {
          userId,
        },
        data: {
          isDefault: false,
        },
      });
    }

    // First address becomes default automatically
    const addressCount = await this.prisma.address.count({
      where: {
        userId,
      },
    });

    const address = await this.prisma.address.create({
      data: {
        userId,

        fullName: dto.fullName,
        phone: dto.phone,

        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,

        city: dto.city,
        state: dto.state,
        country: dto.country,

        postalCode: dto.postalCode,

        isDefault:
          addressCount === 0
            ? true
            : dto.isDefault ?? false,
      },
    });

    return {
      message: "Address added successfully.",
      data: address,
    };
  }

  // Get Logged-in User Addresses
  async findAll(userId: string) {
    const addresses = await this.prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return {
      message: "Addresses fetched successfully.",
      data: addresses,
    };
  }
}