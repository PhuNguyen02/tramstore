// src/payment/gateways/vietqr.gateway.ts
// VietQR integration: https://www.vietqr.io/
// Webhook: SePay (https://sepay.vn) hoặc Casso
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  IPaymentGateway,
  PaymentInitResult,
} from '../interfaces/payment-gateway.interface';

@Injectable()
export class VietqrGateway implements IPaymentGateway {
  private readonly logger = new Logger(VietqrGateway.name);

  private readonly bankBin: string;
  private readonly accountNumber: string;
  private readonly accountName: string;
  private readonly bankName: string;
  private readonly template: string;
  private readonly sepayWebhookSecret: string;

  constructor(private config: ConfigService) {
    this.bankBin = config.get('VIETQR_BANK_BIN') || '970422'; // MB Bank default
    this.accountNumber = config.get('VIETQR_ACCOUNT_NUMBER') || '';
    this.accountName = config.get('VIETQR_ACCOUNT_NAME') || 'TRAM STORE';
    this.bankName = config.get('VIETQR_BANK_NAME') || 'MB Bank';
    this.template = config.get('VIETQR_TEMPLATE') || 'compact2';
    this.sepayWebhookSecret = config.get('SEPAY_WEBHOOK_SECRET') || '';

    if (!this.accountNumber) {
      this.logger.warn(
        '⚠️ VIETQR_ACCOUNT_NUMBER chưa được cấu hình. Vui lòng cập nhật .env',
      );
    } else {
      this.logger.log(
        `✅ VietQR gateway initialized: ${this.bankName} - ${this.accountNumber}`,
      );
    }
  }

  /**
   * Tạo VietQR URL cho đơn hàng
   * Format URL: https://img.vietqr.io/image/{bankBin}-{accountNumber}-{template}.png
   * Query params: amount, addInfo, accountName
   */
  async initiate(order: any): Promise<PaymentInitResult> {
    const amount = Math.round(Number(order.totalAmount));
    const transferContent = this.generateTransferContent(order.id);

    // Tạo QR URL theo chuẩn VietQR
    const qrUrl = this.buildVietQRUrl({
      amount,
      description: transferContent,
    });

    this.logger.log(
      `VietQR payment initiated: order=${order.id}, amount=${amount}, content="${transferContent}"`,
    );

    return {
      gatewayTxId: `VQR_${order.id}`,
      qrData: qrUrl,
      rawResponse: {
        bankName: this.bankName,
        bankBin: this.bankBin,
        accountNumber: this.accountNumber,
        accountName: this.accountName,
        transferContent,
        amount,
        qrUrl,
      },
    };
  }

  /**
   * Xác thực webhook từ SePay
   * SePay gửi webhook với API Key trong header Authorization
   *
   * Payload format từ SePay:
   * {
   *   "id": 92704,
   *   "gateway": "MBBank",
   *   "transactionDate": "2023-03-25 14:02:37",
   *   "accountNumber": "0123499999",
   *   "transferAmount": 2277000,
   *   "content": "TRAMSTORE ABCD1234",
   *   "code": "ABCD1234",
   *   "referenceCode": "208V009252001511",
   *   "transferType": "in"
   * }
   */
  verifyWebhook(payload: Record<string, unknown>, signature: string): boolean {
    if (!this.sepayWebhookSecret) {
      this.logger.warn('SEPAY_WEBHOOK_SECRET chưa được cấu hình');
      return false;
    }

    // SePay: kiểm tra API Key
    return signature === this.sepayWebhookSecret;
  }

  /**
   * Tạo nội dung chuyển khoản duy nhất cho mỗi đơn hàng
   * Format: TS{8 ký tự cuối của orderId} (viết hoa)
   * Ví dụ: TS ABCD1234
   */
  private generateTransferContent(orderId: string): string {
    // Lấy 8 ký tự cuối, loại bỏ dấu "-" trong UUID
    const code = orderId.replace(/-/g, '').slice(-8).toUpperCase();
    return `TS${code}`;
  }

  /**
   * Build VietQR image URL
   * Tham khảo: https://www.vietqr.io/danh-sach-api/link-tao-qr
   */
  private buildVietQRUrl(params: {
    amount: number;
    description: string;
  }): string {
    const { amount, description } = params;
    const baseUrl = `https://img.vietqr.io/image/${this.bankBin}-${this.accountNumber}-${this.template}.png`;
    const queryParams = new URLSearchParams({
      amount: String(amount),
      addInfo: description,
      accountName: this.accountName,
    });
    return `${baseUrl}?${queryParams.toString()}`;
  }
}
