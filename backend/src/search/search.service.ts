import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}
  async search(keyword: string) {
  const products = await this.prisma.product.findMany({
    include: {
      category: true,
      colors: true,
    },
  });

  console.log(products);

  return products;
}

//   async search(keyword: string) {
//     if (!keyword.trim()) {
//       return {
//         products: [],
//         categories: [],
//       };
//     }

//     const [products, categories] = await Promise.all([
//       this.prisma.product.findMany({
//         where: {
//           isActive: true,

//           name: {
//             contains: keyword,
//             mode: 'insensitive',
//           },
//         },

//         select: {
//           id: true,
//           name: true,
//           slug: true,
//           price: true,

//           colors: {
//             take: 1,

//             select: {
//               imageUrl: true,
//             },
//           },

//           category: {
//             select: {
//               name: true,
//             },
//           },
//         },

//         take: 5,
//       }),

//       this.prisma.category.findMany({
//         where: {
//           isActive: true,

//           name: {
//             contains: keyword,
//             mode: 'insensitive',
//           },
//         },

//         select: {
//           id: true,
//           name: true,
//           slug: true,
//         },

//         take: 5,
//       }),
//     ]);

//     return {
//       products: products.map((p) => ({
//         id: p.id,
//         name: p.name,
//         slug: p.slug,
//         price: Number(p.price),
//         image: p.colors[0]?.imageUrl ?? null,
//         category: p.category.name,
//       })),

//       categories,
//     };
//   }
}