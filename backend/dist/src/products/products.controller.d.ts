import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): any[];
    findOne(slug: string): any;
    findByCategory(category: string): any[];
}
