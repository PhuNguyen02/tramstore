// src/payment/gateway.factory.ts
import { Injectable } from '@nestjs/common';
import { IPaymentGateway } from './interfaces/payment-gateway.interface';
import { VietqrGateway } from './gateways/vietqr.gateway';
import { BankTransferGateway } from './gateways/bank-transfer.gateway';

// PaymentMethod values matching the schema
// VietQR là phương thức chính, sử dụng QR VietQR + SePay webhook
const PaymentMethod = {
  VIETQR: 'VIETQR',
  BANK_TRANSFER: 'BANK_TRANSFER', // backward compat → maps to VietQR
} as const;

@Injectable()
export class GatewayFactory {
  constructor(
    private vietqr: VietqrGateway,
    private bankTransfer: BankTransferGateway,
  ) {}

  getGateway(method: string): IPaymentGateway {
    const map: Record<string, IPaymentGateway> = {
      [PaymentMethod.VIETQR]: this.vietqr,
      [PaymentMethod.BANK_TRANSFER]: this.vietqr, // Tất cả chuyển khoản đều dùng VietQR
    };

    const gateway = map[method];
    if (!gateway) {
      throw new Error(`Phương thức thanh toán không được hỗ trợ: ${method}`);
    }
    return gateway;
  }
}
