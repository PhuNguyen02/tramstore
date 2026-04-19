// src/payment/gateways/vnpay.gateway.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as qs from 'qs';
import {
  IPaymentGateway,
  PaymentInitResult,
} from '../interfaces/payment-gateway.interface';

@Injectable()
export class VnpayGateway implements IPaymentGateway {
  private readonly logger = new Logger(VnpayGateway.name);
  private readonly tmnCode: string;
  private readonly secretKey: string;
  private readonly returnUrl: string;
  private readonly vnpUrl =
    'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

  constructor(private config: ConfigService) {
    this.tmnCode = config.get('VNPAY_TMN_CODE') || '';
    this.secretKey = config.get('VNPAY_SECRET_KEY') || '';
    this.returnUrl = config.get('VNPAY_RETURN_URL') || '';
  }

  async initiate(order: any): Promise<PaymentInitResult> {
    if (!this.tmnCode || !this.secretKey) {
      this.logger.warn('VNPay chưa được cấu hình. Trả về URL giả lập.');
      return {
        gatewayTxId: order.id,
        redirectUrl: `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/payment/return?vnp_TxnRef=${order.id}&vnp_ResponseCode=00`,
        rawResponse: { message: 'VNPay sandbox - chưa cấu hình' },
      };
    }

    const date = new Date();
    const createDate = this.formatDate(date);
    const expireDate = this.formatDate(
      new Date(date.getTime() + 15 * 60 * 1000),
    );

    const params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Amount: String(Number(order.totalAmount) * 100),
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: '127.0.0.1',
      vnp_Locale: 'vn',
      vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
      vnp_OrderType: 'other',
      vnp_ReturnUrl: this.returnUrl,
      vnp_TxnRef: order.id,
      vnp_ExpireDate: expireDate,
    };

    // Sắp xếp alphabetical và ký HMAC-SHA512
    const sortedParams = Object.keys(params)
      .sort()
      .reduce(
        (acc, key) => ({ ...acc, [key]: params[key] }),
        {} as Record<string, string>,
      );

    const signData = qs.stringify(sortedParams, { encode: false });
    const signature = crypto
      .createHmac('sha512', this.secretKey)
      .update(signData)
      .digest('hex');

    const redirectUrl = `${this.vnpUrl}?${signData}&vnp_SecureHash=${signature}`;

    this.logger.log(`VNPay payment initiated for order ${order.id}`);

    return {
      gatewayTxId: order.id,
      redirectUrl,
      rawResponse: params,
    };
  }

  verifyWebhook(payload: Record<string, unknown>, signature: string): boolean {
    if (!this.secretKey) return false;

    const params = { ...payload } as Record<string, string>;
    delete params['vnp_SecureHash'];
    delete params['vnp_SecureHashType'];

    const sortedData = Object.keys(params)
      .sort()
      .reduce(
        (acc, key) => ({ ...acc, [key]: params[key] }),
        {} as Record<string, string>,
      );

    const signData = qs.stringify(sortedData, { encode: false });
    const expected = crypto
      .createHmac('sha512', this.secretKey)
      .update(signData)
      .digest('hex');

    return expected === (payload['vnp_SecureHash'] as string);
  }

  private formatDate(date: Date): string {
    return date
      .toISOString()
      .replace(/[-:T.Z]/g, '')
      .slice(0, 14);
  }
}
