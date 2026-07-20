import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { GetInventoryDto } from './dto/get-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class AdminInventoryService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getInventory(
    query: GetInventoryDto,
  ) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        {
          sku: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          variant: {
            product: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      ];
    }

if (category) {
  where.variant = {
    is: {
      product: {
        categoryId: category,
      },
    },
  };
}

    const [inventory, totalInventory] =
      await this.prisma.$transaction([
        this.prisma.inventory.findMany({
          where,

          skip,

          take: limit,

          orderBy: {
            updatedAt: 'desc',
          },

          include: {
            variant: {
              include: {
                color: true,

                product: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        }),

        this.prisma.inventory.count({
          where,
        }),
      ]);

    return {
      success: true,

      inventory,

      pagination: {
        page,

        limit,

        totalInventory,

        totalPages: Math.ceil(
          totalInventory / limit,
        ),

        hasNext:
          page <
          Math.ceil(totalInventory / limit),

        hasPrevious: page > 1,
      },
    };
  }

  async getInventoryById(id: string) {
    const inventory =
      await this.prisma.inventory.findUnique({
        where: {
          id,
        },

        include: {
          variant: {
            include: {
              color: true,

              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

    if (!inventory) {
      throw new BadRequestException(
        'Inventory not found.',
      );
    }
    return {
      success: true,
      inventory,
    };
  }

  async updateInventory(
    id: string,
    dto: UpdateInventoryDto,
  ) {
    const inventory =
      await this.prisma.inventory.findUnique({
        where: {
          id,
        },
      });

    if (!inventory) {
      throw new BadRequestException(
        'Inventory not found.',
      );
    }

    const updatedInventory =
      await this.prisma.inventory.update({
        where: {
          id,
        },

        data: {
          stock: dto.stock,

          lowStockAlert:
            dto.lowStockAlert,
        },

        include: {
          variant: {
            include: {
              color: true,

              product: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

    return {
      success: true,

      message:
        'Inventory updated successfully.',

      inventory: updatedInventory,
    };
  }
}