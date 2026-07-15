
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// import { JwtAdminGuard } from '../admin-auth/guards/jwt-admin.guard';
import { normalizeProductBody } from './utils/parse-product-form-data';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Post()
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'colorImages', maxCount: 20 },
    { name: 'productImages', maxCount: 20 },
  ]),
)

  create(
  @Body() body: any,
  @UploadedFiles() files: { [fieldname: string]: Express.Multer.File[] },
) {
  const normalizedBody: any = normalizeProductBody(body);

  // Convert repeated colorNames into array
  normalizedBody.colorNames = Array.isArray(body.colorNames)
    ? body.colorNames
    : body.colorNames
    ? [body.colorNames]
    : [];

  return this.productsService.create(
    normalizedBody as CreateProductDto,
    files,
  );
}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('categories')
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }


@Patch(':id')
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'colorImages', maxCount: 20 },
    { name: 'productImages', maxCount: 20 },
  ]),
)
update(
  @Param('id') id: string,
  @Body() body: any,
  @UploadedFiles() files: { [fieldname: string]: Express.Multer.File[] },
) {
  const normalizedBody: any = normalizeProductBody(body);

  normalizedBody.colorNames = Array.isArray(body.colorNames)
    ? body.colorNames
    : body.colorNames
    ? [body.colorNames]
    : [];

  return this.productsService.update(
    id,
    normalizedBody as UpdateProductDto,
    files,
  );
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }


  @Get('category/:slug')
findByCategory(@Param('slug') slug: string) {
  return this.productsService.findByCategory(slug);
}

@Get("slug/:slug")
findBySlug(@Param("slug") slug: string) {
  return this.productsService.findBySlug(slug);
}
}
