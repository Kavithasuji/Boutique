import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private minioService: MinioService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    file?: Express.Multer.File,
  ) {
    const { name, description, isActive } = createCategoryDto;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if category with same slug already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    // Upload image to MinIO if provided
    let imageUrl: string | null = null;
    if (file) {
      const uploadedFile = {
        originalname: file.originalname,
        buffer: file.buffer,
        size: file.size,
        mimetype: file.mimetype,
      };
      const objectName = await this.minioService.uploadFile(
        uploadedFile,
        'categories',
      );
      imageUrl = this.minioService.getFileUrl(objectName);
    }

    // Create category
    const category = await this.prisma.category.create({
      data: {
        name,
        slug,
        description,
        image: imageUrl,
        isActive: isActive ?? true,
      },
    });

    return category;
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    file?: Express.Multer.File,
  ) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const { name, description, isActive } = updateCategoryDto;

    // Prepare update data
    const updateData: any = {};

    if (name !== undefined) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const existingCategory = await this.prisma.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (existingCategory) {
        throw new BadRequestException('Category with this name already exists');
      }

      updateData.name = name;
      updateData.slug = slug;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (file) {
      if (category.image) {
        try {
          const objectName = category.image.split('/').pop();
          if (objectName) {
            await this.minioService.deleteFile(`categories/${objectName}`);
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      const uploadedFile = {
        originalname: file.originalname,
        buffer: file.buffer,
        size: file.size,
        mimetype: file.mimetype,
      };
      const objectName = await this.minioService.uploadFile(
        uploadedFile,
        'categories',
      );
      updateData.image = this.minioService.getFileUrl(objectName);
    }

    // Update category
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateData,
    });

    return updatedCategory;
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.products.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with associated products',
      );
    }

    if (category.image) {
      try {
        const objectName = category.image.split('/').pop();
        if (objectName) {
          await this.minioService.deleteFile(`categories/${objectName}`);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Delete category
    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  }
}
