import { ConfigService } from '@nestjs/config';
import { IPaymentGateway, PaymentInitResult } from '../interfaces/payment-gateway.interface';
export declare class VnpayGateway implements IPaymentGateway {
    private config;
    private readonly logger;
    private readonly tmnCode;
    private readonly secretKey;
    private readonly returnUrl;
    private readonly vnpUrl;
    constructor(config: ConfigService);
    initiate(order: any): Promise<PaymentInitResult>;
    verifyWebhook(payload: Record<string, unknown>, signature: string): boolean;
    private formatDate;
}
