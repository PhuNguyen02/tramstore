import { PrismaService } from '../prisma/prisma.service';
import { GatewayFactory } from './gateway.factory';
export declare class PaymentService {
    private prisma;
    private gatewayFactory;
    private readonly logger;
    constructor(prisma: PrismaService, gatewayFactory: GatewayFactory);
    initiatePayment(order: any, method: string): Promise<import("./interfaces/payment-gateway.interface").PaymentInitResult>;
}
