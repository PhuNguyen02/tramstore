// src/payment/interfaces/payment-gateway.interface.ts

export interface PaymentInitResult {
  gatewayTxId: string;
  redirectUrl?: string; // VNPay, Momo
  qrData?: string; // Bank transfer QR
  rawResponse: Record<string, unknown>;
}

export interface IPaymentGateway {
  initiate(order: any): Promise<PaymentInitResult>;
  verifyWebhook(payload: Record<string, unknown>, signature: string): boolean;
}
