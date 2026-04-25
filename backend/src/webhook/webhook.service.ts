// src/webhook/webhook.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayFactory } from '../payment/gateway.factory';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private prisma: PrismaService,
    private gatewayFactory: GatewayFactory,
    private eventEmitter: EventEmitter2,
  ) { }

  /**
   * Xử lý webhook từ SePay
   *
   * SePay webhook payload format:
   * {
   *   "id": 92704,
   *   "gateway": "MBBank",
   *   "transactionDate": "2023-03-25 14:02:37",
   *   "accountNumber": "0123499999",
   *   "transferAmount": 2277000,
   *   "content": "TS ABCD1234 chuyen tien",
   *   "code": "TSABCD1234",
   *   "referenceCode": "208V009252001511",
   *   "transferType": "in"
   * }
   *
   * Luồng xử lý:
   * 1. Verify API key từ SePay
   * 2. Parse nội dung chuyển khoản để tìm mã đơn hàng
   * 3. Tìm payment record qua transferContent (gatewayTxId)
   * 4. Verify số tiền khớp
   * 5. Cập nhật trạng thái đơn hàng + payment
   * 6. Emit event cho notification
   */
  async handleSepay(payload: Record<string, any>, authorization: string) {
    const gateway = this.gatewayFactory.getGateway('VIETQR');

    // Extract API key from "Apikey xxx" format
    const apiKey = authorization?.replace(/^Apikey\s+/i, '') || authorization || '';

    // Verify webhook signature/API key
    if (!gateway.verifyWebhook(payload, apiKey)) {
      this.logger.warn('❌ SePay webhook: API key không hợp lệ');
      return { success: false, message: 'Invalid API key' };
    }

    // Chỉ xử lý giao dịch tiền vào
    if (payload.transferType && payload.transferType !== 'in') {
      this.logger.log('ℹ️ SePay webhook: bỏ qua giao dịch tiền ra');
      return { success: true, message: 'Ignored outgoing transaction' };
    }

    const transferAmount = Number(payload.transferAmount);
    const content = String(payload.content || '').toUpperCase();
    const code = String(payload.code || '').toUpperCase();
    const referenceCode = payload.referenceCode || '';

    this.logger.log(
      `💰 SePay: amount=${transferAmount}, content="${content}", code="${code}", ref="${referenceCode}"`,
    );

    // Tìm Order dựa trên nội dung chuyển khoản
    // SePay trả về "code" là phần nội dung CK đã được parse
    // Hoặc tìm trong "content" (nội dung gốc)
    const payment = await this.findPaymentByTransferContent(content, code);

    if (!payment) {
      this.logger.warn(
        `⚠️ SePay webhook: không tìm thấy payment cho content="${content}", code="${code}"`,
      );
      // Vẫn trả 200 để SePay không retry
      return { success: true, message: 'No matching order found' };
    }

    // Verify số tiền khớp (cho phép sai lệch ±1đ do làm tròn)
    const expectedAmount = Number(payment.amount);
    if (Math.abs(transferAmount - expectedAmount) > 1) {
      this.logger.warn(
        `⚠️ SePay: số tiền không khớp! expected=${expectedAmount}, received=${transferAmount}`,
      );
      // Vẫn cập nhật nhưng log cảnh báo
    }

    await this.updateOrderPaymentStatus(
      payment.orderId,
      true,
      {
        sepayId: payload.id,
        gateway: payload.gateway,
        transactionDate: payload.transactionDate,
        transferAmount,
        content,
        referenceCode,
      },
    );

    return { success: true };
  }

  /**
   * Xác nhận thủ công từ admin (fallback khi SePay không hoạt động)
   */
  async handleManualConfirm(
    payload: { orderId: string; txId: string },
    secret: string,
  ) {
    const gateway = this.gatewayFactory.getGateway('BANK_TRANSFER');

    if (
      !gateway.verifyWebhook(payload as Record<string, unknown>, secret)
    ) {
      this.logger.warn('❌ Manual confirm: secret không hợp lệ');
      throw new Error('Invalid secret');
    }

    await this.updateOrderPaymentStatus(payload.orderId, true, {
      txId: payload.txId,
      manual: true,
    });
    return { success: true };
  }

  /**
   * Tìm payment record dựa trên nội dung chuyển khoản
   * Nội dung CK format: TS{8 ký tự} (ví dụ: TSABCD1234)
   */
  private async findPaymentByTransferContent(content: string, code: string) {
    // 1. Thử tìm theo code trước (SePay đã parse code từ nội dung CK)
    if (code) {
      const byCode = await this.prisma.payment.findFirst({
        where: {
          gatewayTxId: code,
          status: 'INITIATED',
        },
        include: { order: true },
      });
      if (byCode) return byCode;
    }

    // 2. Nếu không thấy, extract mã TS từ content gốc
    // Nội dung CK format: TS{8 ký tự} (ví dụ: TSABCD1234)
    const tsMatch = content.match(/TS([A-Z0-9]{8})/);
    if (tsMatch) {
      const tsCode = tsMatch[0]; // "TSABCD1234"
      const byContent = await this.prisma.payment.findFirst({
        where: {
          gatewayTxId: tsCode,
          status: 'INITIATED',
        },
        include: { order: true },
      });
      if (byContent) return byContent;
    }

    return null;
  }

  // -------------------------------------------------------
  // Hàm trung tâm: cập nhật trạng thái đơn hàng + payment
  // Idempotent: gọi nhiều lần với cùng orderId vẫn an toàn
  // -------------------------------------------------------
  private async updateOrderPaymentStatus(
    orderId: string,
    isSuccess: boolean,
    rawPayload: Record<string, unknown>,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      this.logger.error(`❌ Webhook: không tìm thấy order ${orderId}`);
      return;
    }

    // Idempotency: bỏ qua nếu đã xử lý
    if (order.status === 'PAID' || order.status === 'FAILED') {
      this.logger.log(
        `ℹ️ Order ${orderId} đã được xử lý trước đó (${order.status}), bỏ qua`,
      );
      return;
    }

    const newStatus = isSuccess ? 'PAID' : 'FAILED';
    const paymentStatus = isSuccess ? 'COMPLETED' : 'FAILED';

    // Transaction: cập nhật cả Order và Payment cùng lúc
    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      }),
      this.prisma.payment.updateMany({
        where: { orderId, status: 'INITIATED' },
        data: {
          status: paymentStatus,
          webhookReceivedAt: new Date(),
          webhookPayload: JSON.stringify(rawPayload),
        },
      }),
    ]);

    this.logger.log(`✅ Order ${orderId} → ${newStatus}`);

    // Emit event cho NotificationService
    const eventName = isSuccess ? 'order.paid' : 'order.failed';
    this.eventEmitter.emit(eventName, { orderId });
  }
}
