import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
  
  // 1. Sync Images from Frontend to Backend (Skip in Docker if not available)
  const frontendPublicPath = path.join(__dirname, '../../frontend/public');
  const backendPublicPath = path.join(__dirname, '../public');

  if (!fs.existsSync(backendPublicPath)) {
    fs.mkdirSync(backendPublicPath, { recursive: true });
  }

  if (fs.existsSync(frontendPublicPath)) {
    console.log('--- Đang đồng bộ ảnh từ Frontend sang Backend ---');
    const files = fs.readdirSync(frontendPublicPath);
    files.forEach(file => {
      const src = path.join(frontendPublicPath, file);
      const dest = path.join(backendPublicPath, file);
      if (fs.lstatSync(src).isFile()) {
        try {
          fs.copyFileSync(src, dest);
        } catch (e) {}
      }
    });
  }

  // 2. Read REAL Mock Data
  let mockFilePath = path.join(__dirname, '../../frontend/src/mock/data-product-mock.json');
  
  // Docker path check
  if (!fs.existsSync(mockFilePath)) {
    mockFilePath = path.join(__dirname, 'seed-data/data-product-mock.json');
  }

  if (!fs.existsSync(mockFilePath)) {
    console.error('KHÔNG TÌM THẤY FILE DỮ LIỆU TẠI:', mockFilePath);
    return;
  }

  const data = JSON.parse(fs.readFileSync(mockFilePath, 'utf8'));
  console.log(`Đang xử lý ${data.length} dòng dữ liệu từ data-product-mock.json...`);

  // Group items by Brand or First Word of Title
  const groupedProducts: Record<string, any> = {};
  
  for (const item of data) {
    // Strategy: Group by brand, or if missing, group by the first word (e.g., "Cursor" instead of the whole title)
    let brandKey = item.brand ? item.brand.toLowerCase().trim() : item.title.split(' ')[0].toLowerCase().trim();
    
    // Specially handle Cursor
    if (item.title.toLowerCase().includes('cursor')) brandKey = 'cursor';
    if (item.title.toLowerCase().includes('chatgpt')) brandKey = 'chatgpt';
    if (item.title.toLowerCase().includes('canva')) brandKey = 'canva';
    if (item.title.toLowerCase().includes('adobe')) brandKey = 'adobe';

    if (!groupedProducts[brandKey]) {
      groupedProducts[brandKey] = {
        title: item.brand ? item.brand.toUpperCase() : item.title.split(' - ')[0].split(' (')[0],
        slug: item.slug.split('-')[0], // Base slug
        category: item.category || 'Khác',
        image: item.image || '/file.svg',
        tag: item.tag || '',
        brand: item.brand || brandKey,
        variants: []
      };
    }
    
    // Extract variants
    if (item.variants && item.variants.length > 0) {
      groupedProducts[brandKey].variants.push(...item.variants);
    } else {
      groupedProducts[brandKey].variants.push({
        label: item.title,
        price: item.price || 0,
        originalPrice: item.oldPrice || null,
        discount: item.discount || (item.oldPrice ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0),
        stock: item.stock || 99,
        description: item.description || `${item.title} — sản phẩm cao cấp từ TramStore.`,
        features: item.features || [],
        warranties: item.warranties || []
      });
    }
  }

  const uniqueProducts = Object.values(groupedProducts);
  console.log(`Đã gộp thành ${uniqueProducts.length} sản phẩm duy nhất.`);

  // 3. Create Categories
  const categoryNames = [...new Set(uniqueProducts.map((item: any) => item.category))];
  for (const name of categoryNames) {
    const slug = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ & /g, '-')
      .replace(/ /g, '-');
    
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug }
    });
  }

  const categories = await prisma.category.findMany();
  const categoryMap: Record<string, string> = {};
  categories.forEach((c: any) => {
    categoryMap[c.name] = c.id;
  });

  // 4. CLEANUP OLD DATA (CRITICAL)
  console.log('--- Đang làm sạch Database cũ ---');
  await prisma.variant.deleteMany({});
  await prisma.product.deleteMany({});
  console.log('Đã xóa sạch sản phẩm và biến thể cũ.');

  // 5. Insert Grouped Products
  for (const item of uniqueProducts) {
    const imageUrl = item.image.startsWith('http') 
      ? item.image 
      : `${BACKEND_URL}${item.image.startsWith('/') ? '' : '/'}${item.image}`;

    // Get lowest price and its corresponding oldPrice
    const sortedVariants = [...item.variants].sort((a, b) => a.price - b.price);
    const topVariant = sortedVariants[0];

    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.title,
        price: topVariant?.price || 0,
        oldPrice: topVariant?.originalPrice || null,
        stock: item.variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0),
        categoryId: categoryMap[item.category],
        images: JSON.stringify([imageUrl]),
        tag: item.tag,
        brand: item.brand,
        status: 'active',
        variants: {
          deleteMany: {},
          create: item.variants.map((v: any) => ({
            name: v.label,
            price: v.price || 0,
            originalPrice: v.originalPrice || null,
            discount: v.discount || 0,
            stock: v.stock || 99,
            description: v.description || '',
            features: JSON.stringify(v.features || []),
            warranties: JSON.stringify(v.warranties || [])
          }))
        }
      },
      create: {
        name: item.title,
        slug: item.slug,
        price: topVariant?.price || 0,
        oldPrice: topVariant?.originalPrice || null,
        stock: item.variants.reduce((acc: number, v: any) => acc + (v.stock || 0), 0),
        categoryId: categoryMap[item.category],
        images: JSON.stringify([imageUrl]),
        tag: item.tag,
        brand: item.brand,
        status: 'active',
        variants: {
          create: item.variants.map((v: any) => ({
            name: v.label,
            price: v.price || 0,
            originalPrice: v.originalPrice || null,
            discount: v.discount || 0,
            stock: v.stock || 99,
            description: v.description || '',
            features: JSON.stringify(v.features || []),
            warranties: JSON.stringify(v.warranties || [])
          }))
        }
      }
    });
  }
  console.log('✅ SEEDING HOÀN TẤT: Dữ liệu đã được gộp và đồng bộ.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
