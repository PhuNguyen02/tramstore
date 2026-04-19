import { ConfigService } from '@nestjs/config';
import { IPaymentGateway, PaymentInitResult } from '../interfaces/payment-gateway.interface';
export declare class BankTransferGateway implements IPaymentGateway {
    private config;
    private readonly logger;
    constructor(config: ConfigService);
    initiate(order: any): Promise<PaymentInitResult>;
    verifyWebhook(payload: Record<string, unknown>, signature: string): boolean;
    private buildVietQR;
}
