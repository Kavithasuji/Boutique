import {
  IsBoolean,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateAddressDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  postalCode: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}