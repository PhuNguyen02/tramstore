import { WebhookService } from './webhook.service';
export declare class WebhookController {
    private webhookService;
    private readonly logger;
    constructor(webhookService: WebhookService);
    sepayWebhook(payload: Record<string, any>, authorization: string): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    bankConfirm(payload: {
        orderId: string;
        txId: string;
    }, secret: string): Promise<{
        success: boolean;
    }>;
}
