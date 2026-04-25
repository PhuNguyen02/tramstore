const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const fs = require('fs');
const path = require('path');

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const mockFilePath = path.join(__dirname, '../frontend/src/mock/data-product-mock.json');
  const data = JSON.parse(fs.readFileSync(mockFilePath, 'utf8'));

  console.log(`Bắt đầu nhập ${data.length} sản phẩm (đã gộp theo brand)...`);

  // 1. Tạo categories
  const categoryNames = [...new Set(data.map(item => item.category))];
  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug }
    });
  }

  const categories = await prisma.category.findMany();
  const categoryMap = {};
  categories.forEach(c => { categoryMap[c.name] = c.id; });

  // 2. Xóa dữ liệu cũ
  console.log('Đang xóa dữ liệu cũ...');
  await prisma.variant.deleteMany({});
  await prisma.product.deleteMany({});

  // 3. Nhập từng sản phẩm (đã có variants[])
  for (const item of data) {
    const lowestPrice = Math.min(...item.variants.map(v => v.price));
    const totalStock = item.variants.reduce((acc, v) => acc + (v.stock || 50), 0);

    await prisma.product.create({
      data: {
        name: item.title,
        slug: item.slug,
        price: lowestPrice,
        stock: totalStock,
        categoryId: categoryMap[item.category],
        images: JSON.stringify([item.image]),
        tag: item.tag || null,
        brand: item.brand || null,
        status: 'active',
        variants: {
          create: item.variants.map(v => ({
            name: v.label,
            price: v.price,
            originalPrice: v.originalPrice || null,
            discount: v.discount || 0,
            stock: v.stock || 50,
            description: v.description || `${v.label} — sản phẩm từ TramStore.`,
            features: JSON.stringify(v.features || []),
            warranties: JSON.stringify(v.warranties || []),
          }))
        }
      }
    });
  }

  console.log(`✅ Hoàn thành! Đã nhập ${data.length} sản phẩm.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
