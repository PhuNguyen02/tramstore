export interface PaymentInitResult {
    gatewayTxId: string;
    redirectUrl?: string;
    qrData?: string;
    rawResponse: Record<string, unknown>;
}
export interface IPaymentGateway {
    initiate(order: any): Promise<PaymentInitResult>;
    verifyWebhook(payload: Record<string, unknown>, signature: string): boolean;
}
