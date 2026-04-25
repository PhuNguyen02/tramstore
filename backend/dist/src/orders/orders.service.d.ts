import { PrismaService } from '../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class OrdersService {
    private prisma;
    private paymentService;
    private readonly logger;
    constructor(prisma: PrismaService, paymentService: PaymentService);
    createOrder(dto: CreateOrderDto): Promise<{
        orderId: string;
        status: string;
        qrData: string | undefined;
        bankInfo: Record<string, unknown>;
        expiredAt: Date | null;
    }>;
    getOrderById(id: string): Promise<{
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
    getOrdersByEmail(email: string): Promise<({
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
    cancelOrder(id: string): Promise<{
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
    completeOrder(id: string): Promise<{
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
