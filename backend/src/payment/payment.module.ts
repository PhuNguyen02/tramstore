// src/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { GatewayFactory } from './gateway.factory';
import { VietqrGateway } from './gateways/vietqr.gateway';
import { BankTransferGateway } from './gateways/bank-transfer.gateway';

@Module({
  providers: [
    PaymentService,
    GatewayFactory,
    VietqrGateway,
    BankTransferGateway,
  ],
  exports: [PaymentService, GatewayFactory],
})
export class PaymentModule {}
