"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const adapter = new adapter_better_sqlite3_1.PrismaBetterSqlite3({
    url: 'file:./prisma/dev.db',
});
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
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
                }
                catch (e) { }
            }
        });
    }
    const mockFilePath = path.join(__dirname, '../../frontend/src/mock/data-product-mock.json');
    if (!fs.existsSync(mockFilePath)) {
        console.error('KHÔNG TÌM THẤY FILE DỮ LIỆU TẠI:', mockFilePath);
        return;
    }
    const data = JSON.parse(fs.readFileSync(mockFilePath, 'utf8'));
    console.log(`Đang xử lý ${data.length} dòng dữ liệu từ data-product-mock.json...`);
    const groupedProducts = {};
    for (const item of data) {
        let brandKey = item.brand ? item.brand.toLowerCase().trim() : item.title.split(' ')[0].toLowerCase().trim();
        if (item.title.toLowerCase().includes('cursor'))
            brandKey = 'cursor';
        if (item.title.toLowerCase().includes('chatgpt'))
            brandKey = 'chatgpt';
        if (item.title.toLowerCase().includes('canva'))
            brandKey = 'canva';
        if (item.title.toLowerCase().includes('adobe'))
            brandKey = 'adobe';
        if (!groupedProducts[brandKey]) {
            groupedProducts[brandKey] = {
                title: item.brand ? item.brand.toUpperCase() : item.title.split(' - ')[0].split(' (')[0],
                slug: item.slug.split('-')[0],
                category: item.category || 'Khác',
                image: item.image || '/file.svg',
                tag: item.tag || '',
                brand: item.brand || brandKey,
                variants: []
            };
        }
        if (item.variants && item.variants.length > 0) {
            groupedProducts[brandKey].variants.push(...item.variants);
        }
        else {
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
    const categoryNames = [...new Set(uniqueProducts.map((item) => item.category))];
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
    const categoryMap = {};
    categories.forEach((c) => {
        categoryMap[c.name] = c.id;
    });
    console.log('--- Đang làm sạch Database cũ ---');
    await prisma.variant.deleteMany({});
    await prisma.product.deleteMany({});
    console.log('Đã xóa sạch sản phẩm và biến thể cũ.');
    for (const item of uniqueProducts) {
        const imageUrl = item.image.startsWith('http')
            ? item.image
            : `${BACKEND_URL}${item.image.startsWith('/') ? '' : '/'}${item.image}`;
        const sortedVariants = [...item.variants].sort((a, b) => a.price - b.price);
        const topVariant = sortedVariants[0];
        await prisma.product.upsert({
            where: { slug: item.slug },
            update: {
                name: item.title,
                price: topVariant?.price || 0,
                oldPrice: topVariant?.originalPrice || null,
                stock: item.variants.reduce((acc, v) => acc + (v.stock || 0), 0),
                categoryId: categoryMap[item.category],
                images: JSON.stringify([imageUrl]),
                tag: item.tag,
                brand: item.brand,
                status: 'active',
                variants: {
                    deleteMany: {},
                    create: item.variants.map((v) => ({
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
                stock: item.variants.reduce((acc, v) => acc + (v.stock || 0), 0),
                categoryId: categoryMap[item.category],
                images: JSON.stringify([imageUrl]),
                tag: item.tag,
                brand: item.brand,
                status: 'active',
                variants: {
                    create: item.variants.map((v) => ({
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
//# sourceMappingURL=seed.js.map