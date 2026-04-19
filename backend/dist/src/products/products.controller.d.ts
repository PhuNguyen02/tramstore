import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        category: {
            id: string;
            slug: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        variants: {
            id: string;
            name: string;
            description: string | null;
            price: number;
            stock: number;
            originalPrice: number | null;
            discount: number | null;
            features: string | null;
            warranties: string | null;
            productId: string;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        oldPrice: number | null;
        stock: number;
        images: string | null;
        status: string;
        tag: string | null;
        brand: string | null;
        categoryId: string;
    })[]>;
    search(query: string): import("@prisma/client").Prisma.PrismaPromise<({
        category: {
            id: string;
            slug: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        variants: {
            id: string;
            name: string;
            description: string | null;
            price: number;
            stock: number;
            originalPrice: number | null;
            discount: number | null;
            features: string | null;
            warranties: string | null;
            productId: string;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        oldPrice: number | null;
        stock: number;
        images: string | null;
        status: string;
        tag: string | null;
        brand: string | null;
        categoryId: string;
    })[]>;
    findByCategory(slug: string): import("@prisma/client").Prisma.PrismaPromise<({
        category: {
            id: string;
            slug: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        variants: {
            id: string;
            name: string;
            description: string | null;
            price: number;
            stock: number;
            originalPrice: number | null;
            discount: number | null;
            features: string | null;
            warranties: string | null;
            productId: string;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        oldPrice: number | null;
        stock: number;
        images: string | null;
        status: string;
        tag: string | null;
        brand: string | null;
        categoryId: string;
    })[]>;
    findOne(slug: string): Promise<{
        category: {
            id: string;
            slug: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        variants: {
            id: string;
            name: string;
            description: string | null;
            price: number;
            stock: number;
            originalPrice: number | null;
            discount: number | null;
            features: string | null;
            warranties: string | null;
            productId: string;
        }[];
    } & {
        id: string;
        slug: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        oldPrice: number | null;
        stock: number;
        images: string | null;
        status: string;
        tag: string | null;
        brand: string | null;
        categoryId: string;
    }>;
    create(data: any): import("@prisma/client").Prisma.Prisma__ProductClient<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        oldPrice: number | null;
        stock: number;
        images: string | null;
        status: string;
        tag: string | null;
        brand: string | null;
        categoryId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, data: any): import("@prisma/client").Prisma.Prisma__ProductClient<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        oldPrice: number | null;
        stock: number;
        images: string | null;
        status: string;
        tag: string | null;
        brand: string | null;
        categoryId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__ProductClient<{
        id: string;
        slug: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        price: number;
        oldPrice: number | null;
        stock: number;
        images: string | null;
        status: string;
        tag: string | null;
        brand: string | null;
        categoryId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
