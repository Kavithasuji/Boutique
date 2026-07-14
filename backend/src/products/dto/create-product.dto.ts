// import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsArray, IsNumber, ValidateNested, IsDecimal } from 'class-validator';
// import { Type, Transform } from 'class-transformer';

// export class ProductVariantDto {
//   @IsString()
//   @IsNotEmpty()
//   size: string;

//   @IsString()
//   @IsNotEmpty()
//   color: string;

//   @IsString()
//   @IsOptional()
//   imageUrl?: string;

//   @IsString()
//   @IsNotEmpty()
//   sku: string;

//   @IsNumber()
//   @IsNotEmpty()
//   stock: number;

//   @IsNumber()
//   @IsOptional()
//   lowStockAlert?: number;
// }

// export class ProductImageDto {
//   @IsString()
//   @IsOptional()
//   color?: string;

//   @IsString()
//   @IsNotEmpty()
//   imageUrl: string;

//   @IsBoolean()
//   @IsOptional()
//   isPrimary?: boolean;
// }

// export class CreateProductDto {
//   @IsString()
//   @IsNotEmpty()
//   categoryId: string;

//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsString()
//   @IsOptional()
//   description?: string;

//   @IsNumber()
//   @IsNotEmpty()
//   @Type(() => Number)
//   price: number;

//   @IsNumber()
//   @IsOptional()
//   @Type(() => Number)
//   discountPrice?: number;

//   @IsString()
//   @IsOptional()
//   brand?: string;

//   @IsBoolean()
//   @IsOptional()
//   @Transform(({ value }) => {
//     if (typeof value === 'string') {
//       return value === 'true';
//     }
//     return value;
//   })
//   isFeatured?: boolean;

//   @IsBoolean()
//   @IsOptional()
//   @Transform(({ value }) => {
//     if (typeof value === 'string') {
//       return value === 'true';
//     }
//     return value;
//   })
//   isActive?: boolean;

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => ProductVariantDto)
//   @Transform(({ value }) => {
//     if (typeof value === 'string') {
//       try {
//         return JSON.parse(value);
//       } catch {
//         return value;
//       }
//     }
//     return value;
//   })
//   variants: ProductVariantDto[];

//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => ProductImageDto)
//   @IsOptional()
//   @Transform(({ value }) => {
//     if (typeof value === 'string') {
//       try {
//         return JSON.parse(value);
//       } catch {
//         return value;
//       }
//     }
//     return value;
//   })
//   images?: ProductImageDto[];
// }


import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ProductVariantDto {
  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @Type(() => Number)
  stock: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lowStockAlert?: number;
}

export class ProductImageDto {
  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  discountPrice?: number;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  isActive?: boolean;

  colorNames?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  variants: ProductVariantDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];

    if (typeof value === 'string') {
      return JSON.parse(value);
    }

    return value;
  })
  images?: ProductImageDto[];
}