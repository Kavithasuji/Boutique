import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto, ProductVariantDto, ProductImageDto } from './create-product.dto';
import { Transform, Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @Transform(({ value }) => {
    if (!value) return undefined;

    if (typeof value === 'string') {
      return JSON.parse(value);
    }

    return value;
  })
  variants?: ProductVariantDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @Transform(({ value }) => {
    if (!value) return undefined;

    if (typeof value === 'string') {
      return JSON.parse(value);
    }

    return value;
  })
  images?: ProductImageDto[];
}