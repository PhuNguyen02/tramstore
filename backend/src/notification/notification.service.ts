// src/notification/notification.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Step 8: Webhook SePay xác nhận thanh toán thành công
   * → Gửi email xác nhận cho khách hàng
   * → Thông báo admin có đơn hàng mới (Step 9)
   */
  @OnEvent('order.paid')
  async onOrderPaid(payload: { orderId: string }) {
    const order = await this.prisma.order.findUnique({
      where: { id: payload.orderId },
      include: { payments: true },
    });

    if (!order) return;

    // ─── Step 8: Thông báo khách hàng ───────────────────
    this.logger.log(
      `📧 [KHÁCH HÀNG] Gửi email xác nhận đơn hàng ${order.id} tới ${order.customerEmail}`,
    );
    // TODO: Tích hợp NodeMailer / Resend.com
    // await this.emailService.sendOrderConfirmation({
    //   to: order.customerEmail,
    //   orderId: order.id,
    //   amount: order.totalAmount,
    //   productId: order.productId,
    //   customerName: order.customerName,
    // });

    // ─── Step 9: Thông báo admin ────────────────────────
    this.logger.log(
      `🔔 [ADMIN] Đơn hàng mới! #${order.id.slice(0, 8).toUpperCase()} | ` +
      `${order.customerName} | ${order.customerEmail} | ` +
      `${order.totalAmount}đ | SĐT: ${order.customerPhone}`,
    );
    // TODO: Tích hợp Telegram / Discord / Zalo OA notification
    // await this.telegramService.sendAdminAlert({
    //   orderId: order.id,
    //   customerName: order.customerName,
    //   customerEmail: order.customerEmail,
    //   customerPhone: order.customerPhone,
    //   amount: order.totalAmount,
    // });

    // ─── Step 10: Admin sẽ thủ công gửi account qua email ──
    // Sau khi gửi, admin gọi PATCH /orders/:id/complete (Step 11)
    this.logger.log(
      `📋 [TODO] Admin cần gửi account cho đơn hàng ${order.id} → email: ${order.customerEmail}`,
    );
  }

  @OnEvent('order.failed')
  async onOrderFailed(payload: { orderId: string }) {
    const order = await this.prisma.order.findUnique({
      where: { id: payload.orderId },
    });
    if (!order) return;

    this.logger.log(
      `⚠️ Thông báo thanh toán thất bại tới ${order.customerEmail}`,
    );
    // TODO: Gửi email với link để thử lại
  }
}
