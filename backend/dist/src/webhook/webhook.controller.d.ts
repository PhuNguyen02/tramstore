import { WebhookService } from './webhook.service';
export declare class WebhookController {
    private webhookService;
    private readonly logger;
    constructor(webhookService: WebhookService);
    payosWebhook(payload: Record<string, any>): Promise<{
        success: boolean;
        message: string;
    } | {
        success: boolean;
        message?: undefined;
    }>;
    stripeWebhook(req: any, signature: string): Promise<{
        received: boolean;
    }>;
    bankConfirm(payload: {
        orderId: string;
        txId: string;
    }, secret: string): Promise<{
        success: boolean;
    }>;
}
