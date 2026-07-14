import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';
import { CreateProductDto, ProductVariantDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


  @Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private minioService: MinioService,
  ) {}


  async create(
  createProductDto: CreateProductDto,
  files?: { [fieldname: string]: Express.Multer.File[] },
) {
  try {
    console.log('========== CREATE PRODUCT ==========');
    console.log('Incoming DTO:', createProductDto);

    const {
      categoryId,
      name,
      description,
      price,
      discountPrice,
      brand,
      isFeatured,
      isActive,
      variants,
      images = [],
      colorNames = [],
    } = createProductDto as any;

    console.log('Category ID:', categoryId);
    console.log('Product Name:', name);
    console.log('Variants:', variants);
    console.log('Color Names:', colorNames);

    console.log('Checking category...');

    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    console.log('Category Result:', category);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    console.log('Generating slug...');

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    console.log('Slug:', slug);

    console.log('Checking duplicate product...');

    const existingProduct = await this.prisma.product.findUnique({
      where: { slug },
    });

    console.log('Duplicate Product:', existingProduct);

    if (existingProduct) {
      throw new BadRequestException(
        'Product with this name already exists',
      );
    }

    console.log('Uploading color images...');

    const uploadedColors: any[] = [];

    if (files?.colorImages?.length) {
      console.log(
        'Total Color Images:',
        files.colorImages.length,
      );

      for (let i = 0; i < files.colorImages.length; i++) {
        const file = files.colorImages[i];

        console.log('Uploading Image', i + 1);
        console.log(file.originalname);

        const uploadedFile = {
          originalname: file.originalname,
          buffer: file.buffer,
          mimetype: file.mimetype,
          size: file.size,
        };

        const objectName = await this.minioService.uploadFile(
          uploadedFile,
          'products/colors',
        );

        console.log('Uploaded Object:', objectName);

        uploadedColors.push({
          color: colorNames[i],
          imageUrl: this.minioService.getFileUrl(objectName),
        });

        console.log('Current Uploaded Colors:', uploadedColors);
      }
    } else {
      console.log('No color images received');
    }

    console.log('Creating Product...');

    const product = await this.prisma.product.create({
      data: {
        categoryId,
        name,
        slug,
        description,
        price: price.toString(),
        discountPrice: discountPrice
          ? discountPrice.toString()
          : null,
        brand,
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true,

        colors: {
          create: uploadedColors.map((color) => ({
            color: color.color,
            imageUrl: color.imageUrl,
          })),
        },
      },
      include: {
        colors: true,
      },
    });

    console.log('Product Created Successfully');
    console.log(product);

    console.log('Creating Variants...');

    for (const variant of variants) {
      console.log('Variant:', variant);

      const color = await this.prisma.productColor.findFirst({
        where: {
          productId: product.id,
          color: variant.color,
        },
      });

      console.log('Matched Color:', color);

      if (!color) {
        console.log('Color Not Found. Skipping...');
        continue;
      }

      const createdVariant =
        await this.prisma.productVariant.create({
          data: {
            productId: product.id,
            colorId: color.id,
            size: variant.size,

            inventory: {
              create: {
                sku: variant.sku,
                stock: variant.stock,
                lowStockAlert:
                  variant.lowStockAlert ?? 5,
              },
            },
          },
        });

      console.log('Variant Created:', createdVariant);
    }

    console.log('Fetching Final Product...');

    const result = await this.prisma.product.findUnique({
      where: {
        id: product.id,
      },
      include: {
        category: true,
        colors: true,
        variants: {
          include: {
            color: true,
            inventory: true,
          },
        },
      },
    });

    console.log('SUCCESS');
    console.log(result);
    console.log('================================');

    return result;
  } catch (error) {
    console.log('================================');
    console.log('CREATE PRODUCT FAILED');
    console.log(error);
    console.log('================================');

    throw error;
  }
}


async findAll() {
  return this.prisma.product.findMany({
    include: {
      category: true,

      colors: true,

      variants: {
        include: {
          color: true,
          inventory: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });
}



async remove(id: string) {
  const product = await this.prisma.product.findUnique({
    where: { id },
    include: {
      colors: true,
    },
  });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  for (const color of product.colors) {
    try {
      const objectName = color.imageUrl.split('/').pop();

      if (objectName) {
        await this.minioService.deleteFile(
          `products/colors/${objectName}`,
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  await this.prisma.product.delete({
    where: { id },
  });

  return {
    message: 'Product deleted successfully',
  };
}

async getCategories() {
  return this.prisma.category.findMany({
    where: {
      isActive: true,
    },

    orderBy: {
      name: 'asc',
    },
  });
}
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            inventory: true,
          },
        },
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

async update(
  id: string,
  updateProductDto: UpdateProductDto,
  files?: { [fieldname: string]: Express.Multer.File[] },
) {
  const existingProduct = await this.prisma.product.findUnique({
    where: { id },
    include: {
      colors: true,
      variants: {
        include: {
          color: true,
          inventory: true,
        },
      },
    },
  });

  if (!existingProduct) {
    throw new NotFoundException('Product not found');
  }

  const {
    categoryId,
    name,
    description,
    price,
    discountPrice,
    brand,
    isFeatured,
    isActive,
    variants = [],
    colorNames = [],
  } = updateProductDto as any;

  const updateData: any = {};

  // Category
  if (categoryId) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    updateData.categoryId = categoryId;
  }

  // Name + Slug
  if (name) {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const duplicate = await this.prisma.product.findFirst({
      where: {
        slug,
        id: {
          not: id,
        },
      },
    });

    if (duplicate) {
      throw new BadRequestException(
        'Product with this name already exists',
      );
    }

    updateData.name = name;
    updateData.slug = slug;
  }

  if (description !== undefined)
    updateData.description = description;

  if (price !== undefined)
    updateData.price = price.toString();

  if (discountPrice !== undefined)
    updateData.discountPrice = discountPrice.toString();

  if (brand !== undefined)
    updateData.brand = brand;

  if (isFeatured !== undefined)
    updateData.isFeatured = isFeatured;

  if (isActive !== undefined)
    updateData.isActive = isActive;

  await this.prisma.product.update({
    where: { id },
    data: updateData,
  });


  const colorImageNames = Array.isArray((updateProductDto as any).colorImageNames)
  ? (updateProductDto as any).colorImageNames
  : (updateProductDto as any).colorImageNames
  ? [(updateProductDto as any).colorImageNames]
  : [];

const imageMap = new Map<string, Express.Multer.File>();

files?.colorImages?.forEach((file, index) => {
  imageMap.set(colorImageNames[index], file);
});
  // =====================================
  // UPDATE COLORS
  // =====================================
  // Existing colors in DB
  const dbColors = await this.prisma.productColor.findMany({
    where: {
      productId: id,
    },
  });

  const usedColorIds: string[] = [];

  for (let i = 0; i < colorNames.length; i++) {
    const colorName = colorNames[i];

    const existingColor = dbColors.find(
      (c) => c.color === colorName,
    );

let imageUrl: string = existingColor?.imageUrl ?? '';
    // Upload new image if user selected one
  const file = imageMap.get(colorName);

if (file) {
  const objectName = await this.minioService.uploadFile(
    {
      originalname: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype,
      size: file.size,
    },
    'products/colors',
  );

  imageUrl = this.minioService.getFileUrl(objectName);
}

    if (existingColor) {
      const updated = await this.prisma.productColor.update({
        where: {
          id: existingColor.id,
        },
        data: {
          imageUrl,
        },
      });

      usedColorIds.push(updated.id);
    } else {
      const created =  await this.prisma.productColor.create({
  data: {
    productId: id,
    color: colorName,
    imageUrl: imageUrl ?? '',
  },
});

      usedColorIds.push(created.id);
    }
  }

  /*
   * Delete colors removed by user
   */

  const colorsToDelete = dbColors.filter(
    (c) => !usedColorIds.includes(c.id),
  );

  for (const color of colorsToDelete) {
    await this.prisma.inventory.deleteMany({
      where: {
        variant: {
          colorId: color.id,
        },
      },
    });

    await this.prisma.productVariant.deleteMany({
      where: {
        colorId: color.id,
      },
    });

    await this.prisma.productColor.delete({
      where: {
        id: color.id,
      },
    });
  }

  // =====================================
  // UPDATE VARIANTS
  // =====================================
  const dbVariants = await this.prisma.productVariant.findMany({
    where: {
      productId: id,
    },
    include: {
      inventory: true,
      color: true,
    },
  });

  const usedVariantIds: string[] = [];

  for (const variant of variants) {
    const color = await this.prisma.productColor.findFirst({
      where: {
        productId: id,
        color: variant.color,
      },
    });

    if (!color) continue;

    const existingVariant = dbVariants.find(
      (v) =>
        v.colorId === color.id &&
        v.size === variant.size,
    );

    if (existingVariant) {
      usedVariantIds.push(existingVariant.id);

      if (existingVariant.inventory) {
        await this.prisma.inventory.update({
          where: {
            variantId: existingVariant.id,
          },
          data: {
            sku: variant.sku,
            stock: variant.stock,
            lowStockAlert:
              variant.lowStockAlert ?? 5,
          },
        });
      } else {
        await this.prisma.inventory.create({
          data: {
            variantId: existingVariant.id,
            sku: variant.sku,
            stock: variant.stock,
            lowStockAlert:
              variant.lowStockAlert ?? 5,
          },
        });
      }
    } else {
      const createdVariant =
        await this.prisma.productVariant.create({
          data: {
            productId: id,
            colorId: color.id,
            size: variant.size,

            inventory: {
              create: {
                sku: variant.sku,
                stock: variant.stock,
                lowStockAlert:
                  variant.lowStockAlert ?? 5,
              },
            },
          },
        });

      usedVariantIds.push(createdVariant.id);
    }
  }

  /*
   * Delete removed variants
   */

  const variantsToDelete = dbVariants.filter(
    (v) => !usedVariantIds.includes(v.id),
  );

  for (const variant of variantsToDelete) {
    if (variant.inventory) {
      await this.prisma.inventory.delete({
        where: {
          variantId: variant.id,
        },
      });
    }

    await this.prisma.productVariant.delete({
      where: {
        id: variant.id,
      },
    });
  }

  // =====================================
  // RETURN UPDATED PRODUCT
  // =====================================
  return await this.prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      category: true,

      colors: {
        orderBy: {
          color: 'asc',
        },
      },

      variants: {
        orderBy: [
          {
            color: {
              color: 'asc',
            },
          },
          {
            size: 'asc',
          },
        ],
        include: {
          color: true,
          inventory: true,
        },
      },
    },
  });
}

async findByCategory(slug: string) {
  const category = await this.prisma.category.findUnique({
    where: {
      slug,
    },
  });

  if (!category) {
    throw new NotFoundException("Category not found");
  }

  const products = await this.prisma.product.findMany({
    where: {
      categoryId: category.id,
      isActive: true,
    },

    include: {
      category: true,

      colors: true,

      variants: {
        include: {
          color: true,
          inventory: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    category,
    products,
  };
}
}
