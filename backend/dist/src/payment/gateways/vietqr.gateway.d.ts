import { ConfigService } from '@nestjs/config';
import { IPaymentGateway, PaymentInitResult } from '../interfaces/payment-gateway.interface';
export declare class VietqrGateway implements IPaymentGateway {
    private config;
    private readonly logger;
    private readonly bankBin;
    private readonly accountNumber;
    private readonly accountName;
    private readonly bankName;
    private readonly template;
    private readonly sepayWebhookSecret;
    constructor(config: ConfigService);
    initiate(order: any): Promise<PaymentInitResult>;
    verifyWebhook(payload: Record<string, unknown>, signature: string): boolean;
    private generateTransferContent;
    private buildVietQRUrl;
}
