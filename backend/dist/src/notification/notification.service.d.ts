import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onOrderPaid(payload: {
        orderId: string;
    }): Promise<void>;
    onOrderFailed(payload: {
        orderId: string;
    }): Promise<void>;
}
