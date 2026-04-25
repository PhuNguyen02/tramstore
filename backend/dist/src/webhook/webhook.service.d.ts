import { PrismaService } from '../prisma/prisma.service';
import { GatewayFactory } from '../payment/gateway.factory';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class WebhookService {
    private prisma;
    private gatewayFactory;
    private eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, gatewayFactory: GatewayFactory, eventEmitter: EventEmitter2);
    handleSepay(payload: Record<string, any>, authorization: string): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    handleManualConfirm(payload: {
        orderId: string;
        txId: string;
    }, secret: string): Promise<{
        success: boolean;
    }>;
    private findPaymentByTransferContent;
    private updateOrderPaymentStatus;
}
