import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  private readonly mockFilePath = path.join(
    process.cwd(),
    'src/mock/products.json',
  );

  private getMockData(): any[] {
    try {
      const data = fs.readFileSync(this.mockFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  findAll() {
    return this.getMockData();
  }

  findOne(slug: string) {
    const products = this.getMockData();
    const product = products.find((p) => p.slug === slug);
    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }
    return product;
  }

  findByCategory(category: string) {
    const products = this.getMockData();
    return products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }
}
