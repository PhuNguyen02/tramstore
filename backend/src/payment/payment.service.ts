// src/payment/payment.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayFactory } from './gateway.factory';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private prisma: PrismaService,
    private gatewayFactory: GatewayFactory,
  ) {}

  async initiatePayment(order: any, method: string) {
    const gateway = this.gatewayFactory.getGateway(method);
    const result = await gateway.initiate(order);

    // Lưu bản ghi Payment
    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        method,
        status: 'INITIATED',
        gatewayTxId: result.gatewayTxId,
        gatewayData: JSON.stringify(result.rawResponse),
        amount: order.totalAmount,
      },
    });

    this.logger.log(
      `Payment initiated: order=${order.id}, method=${method}, txId=${result.gatewayTxId}`,
    );

    return result;
  }
}
