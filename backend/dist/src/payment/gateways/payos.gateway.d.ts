import { ConfigService } from '@nestjs/config';
import { IPaymentGateway, PaymentInitResult } from '../interfaces/payment-gateway.interface';
export declare class PayosGateway implements IPaymentGateway {
    private config;
    private readonly logger;
    private payosClient;
    private readonly clientId;
    private readonly apiKey;
    private readonly checksumKey;
    constructor(config: ConfigService);
    private initClient;
    initiate(order: any): Promise<PaymentInitResult>;
    verifyWebhook(payload: Record<string, unknown>, signature: string): boolean;
    private generateOrderCode;
}
