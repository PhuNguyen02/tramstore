// src/payment/gateways/stripe.gateway.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IPaymentGateway,
  PaymentInitResult,
} from '../interfaces/payment-gateway.interface';

@Injectable()
export class StripeGateway implements IPaymentGateway {
  private readonly logger = new Logger(StripeGateway.name);

  constructor(private config: ConfigService) {}

  async initiate(order: any): Promise<PaymentInitResult> {
    const secretKey = this.config.get('STRIPE_SECRET_KEY');

    if (!secretKey) {
      this.logger.warn('Stripe chưa được cấu hình. Trả về URL giả lập.');
      return {
        gatewayTxId: `stripe_sim_${order.id}`,
        redirectUrl: `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/orders/${order.id}?status=success`,
        rawResponse: { message: 'Stripe sandbox - chưa cấu hình' },
      };
    }

    // Khi đã có Stripe SDK:
    // const stripe = new Stripe(secretKey);
    // const session = await stripe.checkout.sessions.create({ ... });
    // return { gatewayTxId: session.id, redirectUrl: session.url, rawResponse: session };

    this.logger.log(`Stripe payment initiated for order ${order.id}`);

    return {
      gatewayTxId: `stripe_${order.id}`,
      redirectUrl: `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/orders/${order.id}?status=success`,
      rawResponse: { message: 'Stripe - placeholder' },
    };
  }

  verifyWebhook(payload: Record<string, unknown>, signature: string): boolean {
    const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) return false;

    // Khi đã có Stripe SDK:
    // try {
    //   stripe.webhooks.constructEvent(payload['rawBody'], signature, webhookSecret);
    //   return true;
    // } catch { return false; }

    return true;
  }
}
