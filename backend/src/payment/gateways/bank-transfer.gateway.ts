// src/payment/gateways/bank-transfer.gateway.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IPaymentGateway,
  PaymentInitResult,
} from '../interfaces/payment-gateway.interface';

@Injectable()
export class BankTransferGateway implements IPaymentGateway {
  private readonly logger = new Logger(BankTransferGateway.name);

  constructor(private config: ConfigService) {}

  async initiate(order: any): Promise<PaymentInitResult> {
    const bankAccount =
      this.config.get('BANK_ACCOUNT_NUMBER') || '1234567890';
    const bankName = this.config.get('BANK_NAME') || 'Vietcombank';
    const bankBin = this.config.get('BANK_BIN') || '970436';
    const transferContent = `TRAMSTORE ${order.id.slice(0, 8).toUpperCase()}`;

    // Tạo QR VietQR (chuẩn NAPAS)
    const qrData = this.buildVietQR({
      bankBin,
      accountNumber: bankAccount,
      amount: Number(order.totalAmount),
      description: transferContent,
    });

    this.logger.log(
      `Bank transfer initiated for order ${order.id}: ${transferContent}`,
    );

    return {
      gatewayTxId: `BANK_${order.id}`,
      qrData,
      rawResponse: {
        bankName,
        bankAccount,
        transferContent,
        amount: order.totalAmount,
      },
    };
  }

  // Webhook xác nhận thủ công bởi admin hoặc SePay/Casso
  verifyWebhook(payload: Record<string, unknown>, signature: string): boolean {
    const adminSecret = this.config.get('BANK_WEBHOOK_SECRET');
    return signature === adminSecret;
  }

  private buildVietQR(params: {
    bankBin: string;
    accountNumber: string;
    amount: number;
    description: string;
  }): string {
    const { bankBin, accountNumber, amount, description } = params;
    return `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}`;
  }
}
