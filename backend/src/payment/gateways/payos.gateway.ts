// src/payment/gateways/payos.gateway.ts
// PayOS integration: https://payos.vn/docs/api/
// SDK: @payos/node
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  IPaymentGateway,
  PaymentInitResult,
} from '../interfaces/payment-gateway.interface';

@Injectable()
export class PayosGateway implements IPaymentGateway {
  private readonly logger = new Logger(PayosGateway.name);
  private payosClient: any = null;

  private readonly clientId: string;
  private readonly apiKey: string;
  private readonly checksumKey: string;

  constructor(private config: ConfigService) {
    this.clientId = config.get('PAYOS_CLIENT_ID') || '';
    this.apiKey = config.get('PAYOS_API_KEY') || '';
    this.checksumKey = config.get('PAYOS_CHECKSUM_KEY') || '';

    this.initClient();
  }

  private async initClient() {
    if (!this.clientId || !this.apiKey || !this.checksumKey) {
      this.logger.warn(
        'PayOS chưa được cấu hình đầy đủ (PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY). Chạy ở chế độ giả lập.',
      );
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const payosModule = require('@payos/node');
      // Handle different export patterns (ESM default, CommonJS, named)
      const PayOSClass =
        typeof payosModule === 'function'
          ? payosModule
          : typeof payosModule.default === 'function'
            ? payosModule.default
            : payosModule.PayOS;

      if (!PayOSClass) {
        this.logger.error(
          `PayOS module exports: ${Object.keys(payosModule).join(', ')}`,
        );
        throw new Error('Không tìm thấy PayOS constructor');
      }

      this.payosClient = new PayOSClass(
        this.clientId,
        this.apiKey,
        this.checksumKey,
      );
      this.logger.log('✅ PayOS client initialized successfully');
    } catch (err) {
      this.logger.warn(
        `PayOS SDK init failed: ${err.message}`,
      );
    }
  }

  async initiate(order: any): Promise<PaymentInitResult> {
    // Tạo orderCode dạng số (PayOS yêu cầu kiểu Number)
    // Lấy timestamp + random để đảm bảo unique
    const orderCode = this.generateOrderCode();

    if (!this.payosClient) {
      this.logger.warn('PayOS client chưa sẵn sàng. Trả về URL giả lập.');
      return {
        gatewayTxId: String(orderCode),
        redirectUrl: `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/payment/return?orderCode=${orderCode}&status=PAID`,
        qrData: `https://img.vietqr.io/image/970422-113366668888-compact2.png?amount=${Math.round(Number(order.totalAmount))}&addInfo=${encodeURIComponent(`TRAMSTORE ${order.id.slice(0, 8).toUpperCase()}`)}`,
        rawResponse: {
          message: 'PayOS demo mode - chưa cấu hình',
          orderCode,
          orderId: order.id,
        },
      };
    }

    try {
      const cancelUrl =
        this.config.get('PAYOS_CANCEL_URL') ||
        `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/payment/cancel`;
      const returnUrl =
        this.config.get('PAYOS_RETURN_URL') ||
        `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/payment/return`;

      const paymentData = {
        orderCode,
        amount: Math.round(Number(order.totalAmount)),
        description: `TRAMSTORE ${order.id.slice(0, 8).toUpperCase()}`,
        buyerName: order.customerName || undefined,
        buyerEmail: order.customerEmail || undefined,
        buyerPhone: order.customerPhone || undefined,
        items: [
          {
            name: `Đơn hàng #${order.id.slice(0, 8)}`,
            quantity: order.quantity || 1,
            price: Math.round(Number(order.unitPrice)),
          },
        ],
        cancelUrl,
        returnUrl,
        expiredAt: Math.floor(
          (order.expiredAt
            ? new Date(order.expiredAt).getTime()
            : Date.now() + 15 * 60 * 1000) / 1000,
        ),
      };

      this.logger.log(
        `Creating PayOS payment: orderCode=${orderCode}, amount=${paymentData.amount}`,
      );

      const paymentLink =
        await this.payosClient.createPaymentLink(paymentData);

      this.logger.log(
        `✅ PayOS payment link created: ${paymentLink.checkoutUrl}`,
      );

      return {
        gatewayTxId: String(orderCode),
        redirectUrl: paymentLink.checkoutUrl,
        qrData: paymentLink.qrCode,
        rawResponse: {
          ...paymentLink,
          internalOrderId: order.id,
          orderCode,
        },
      };
    } catch (err) {
      this.logger.error(`PayOS createPaymentLink failed: ${err.message}`);
      throw new Error(`Không thể tạo link thanh toán PayOS: ${err.message}`);
    }
  }

  /**
   * Xác thực webhook payload từ PayOS
   * PayOS gửi webhook với signature = HMAC_SHA256(checksumKey, data)
   * data format: sorted alphabetically key=value&key=value
   */
  verifyWebhook(payload: Record<string, unknown>, signature: string): boolean {
    if (!this.checksumKey) return false;

    try {
      // Nếu có payosClient, dùng SDK verify
      if (this.payosClient) {
        const verified = this.payosClient.verifyPaymentWebhookData(payload);
        return !!verified;
      }

      // Manual verification fallback
      const data = payload['data'] as Record<string, unknown>;
      if (!data) return false;

      const sortedKeys = Object.keys(data).sort();
      const signData = sortedKeys
        .map((key) => `${key}=${data[key]}`)
        .join('&');

      const expected = crypto
        .createHmac('sha256', this.checksumKey)
        .update(signData)
        .digest('hex');

      return expected === signature;
    } catch (err) {
      this.logger.error(`PayOS webhook verification failed: ${err.message}`);
      return false;
    }
  }

  /**
   * Tạo orderCode dạng số duy nhất cho PayOS
   * Format: timestamp cuối (8 chữ số) + random (4 chữ số)
   * Đảm bảo <= 2^31 - 1 (Int32 max)
   */
  private generateOrderCode(): number {
    const timestamp = Date.now() % 100000000; // 8 chữ số cuối
    const random = Math.floor(Math.random() * 10000); // 4 chữ số
    // Đảm bảo trong khoảng Int32
    return (timestamp * 10000 + random) % 2147483647;
  }
}
