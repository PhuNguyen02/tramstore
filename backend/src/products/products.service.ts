import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      include: { category: true, variants: true },
    });
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true, variants: true },
    });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    return product;
  }

  findByCategory(categorySlug: string) {
    return this.prisma.product.findMany({
      where: { category: { slug: categorySlug } },
      include: { category: true, variants: true },
    });
  }

  search(query: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
      },
      include: { category: true, variants: true },
    });
  }

  create(data: any) {
    return this.prisma.product.create({
      data: {
        ...data,
        variants: {
          create: data.variants || [],
        },
      },
    });
  }

  update(id: string, data: any) {
    const { variants, ...productData } = data;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        // Optional: handle variant updates if needed
      },
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
