import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto): Promise<{
        orderId: string;
        status: string;
        qrData: string | undefined;
        bankInfo: Record<string, unknown>;
        expiredAt: Date | null;
    }>;
    findOne(id: string): Promise<{
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            gatewayTxId: string | null;
            amount: number;
            method: string;
            gatewayData: string | null;
            webhookReceivedAt: Date | null;
            webhookPayload: string | null;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        productId: string;
        customerEmail: string;
        customerName: string | null;
        customerPhone: string | null;
        variantId: string;
        note: string | null;
        quantity: number;
        unitPrice: number;
        totalAmount: number;
        expiredAt: Date | null;
    }>;
    findByEmail(email: string): Promise<({
        payments: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            gatewayTxId: string | null;
            amount: number;
            method: string;
            gatewayData: string | null;
            webhookReceivedAt: Date | null;
            webhookPayload: string | null;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        productId: string;
        customerEmail: string;
        customerName: string | null;
        customerPhone: string | null;
        variantId: string;
        note: string | null;
        quantity: number;
        unitPrice: number;
        totalAmount: number;
        expiredAt: Date | null;
    })[]>;
    cancel(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        productId: string;
        customerEmail: string;
        customerName: string | null;
        customerPhone: string | null;
        variantId: string;
        note: string | null;
        quantity: number;
        unitPrice: number;
        totalAmount: number;
        expiredAt: Date | null;
    }>;
    complete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        productId: string;
        customerEmail: string;
        customerName: string | null;
        customerPhone: string | null;
        variantId: string;
        note: string | null;
        quantity: number;
        unitPrice: number;
        totalAmount: number;
        expiredAt: Date | null;
    }>;
}
