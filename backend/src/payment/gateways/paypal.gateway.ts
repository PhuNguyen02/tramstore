// src/payment/gateways/paypal.gateway.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IPaymentGateway,
  PaymentInitResult,
} from '../interfaces/payment-gateway.interface';

@Injectable()
export class PaypalGateway implements IPaymentGateway {
  private readonly logger = new Logger(PaypalGateway.name);

  constructor(private config: ConfigService) {}

  async initiate(order: any): Promise<PaymentInitResult> {
    const clientId = this.config.get('PAYPAL_CLIENT_ID');

    if (!clientId) {
      this.logger.warn('PayPal chưa được cấu hình. Trả về URL giả lập.');
      return {
        gatewayTxId: `paypal_sim_${order.id}`,
        redirectUrl: `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/orders/${order.id}?status=success`,
        rawResponse: { message: 'PayPal sandbox - chưa cấu hình' },
      };
    }

    // TODO: Tích hợp PayPal REST API
    // 1. POST /v2/checkout/orders → tạo order trên PayPal
    // 2. Trả về approve URL cho client redirect

    this.logger.log(`PayPal payment initiated for order ${order.id}`);

    return {
      gatewayTxId: `paypal_${order.id}`,
      redirectUrl: `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/orders/${order.id}?status=success`,
      rawResponse: { message: 'PayPal - placeholder' },
    };
  }

  verifyWebhook(payload: Record<string, unknown>, signature: string): boolean {
    // TODO: Verify PayPal webhook signature
    return true;
  }
}
