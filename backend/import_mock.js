const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const mockFilePath = path.join(__dirname, '../frontend/src/mock/data-product-mock.json');
  const data = JSON.parse(fs.readFileSync(mockFilePath, 'utf8'));

  console.log(`Bắt đầu nhập ${data.length} sản phẩm...`);

  // 1. Thu thập tất cả các danh mục duy nhất
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
  categories.forEach(c => {
    categoryMap[c.name] = c.id;
  });

  // 2. Nhập sản phẩm
  for (const item of data) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.title,
        price: item.price,
        oldPrice: item.originalPrice,
        categoryId: categoryMap[item.category],
        images: [item.image],
        status: 'active'
      },
      create: {
        name: item.title,
        slug: item.slug,
        price: item.price,
        oldPrice: item.originalPrice,
        stock: Math.floor(Math.random() * 100) + 10,
        categoryId: categoryMap[item.category],
        images: [item.image],
        status: 'active'
      }
    });
  }

  console.log('Hoàn thành nhập liệu.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
