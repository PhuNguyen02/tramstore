// src/orders/orders.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    // 1. Lấy thông tin variant để tính giá
    const variant = await this.prisma.variant.findUnique({
      where: { id: dto.variantId },
      include: { product: true },
    });

    if (!variant) {
      throw new NotFoundException(
        `Variant ${dto.variantId} không tồn tại`,
      );
    }

    // Kiểm tra productId khớp với variant
    if (variant.productId !== dto.productId) {
      throw new BadRequestException(
        'Variant không thuộc sản phẩm đã chọn',
      );
    }

    const totalAmount = variant.price;
    const paymentMethod = dto.paymentMethod || 'VIETQR';

    // 2. Tạo đơn hàng với trạng thái PENDING
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    const order = await this.prisma.order.create({
      data: {
        customerEmail: dto.customerEmail,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        productId: dto.productId,
        variantId: dto.variantId,
        unitPrice: variant.price,
        totalAmount,
        note: dto.note,
        status: 'PENDING',
        expiredAt,
      },
    });

    this.logger.log(
      `🛒 Order created: ${order.id} | ${variant.product.name} - ${variant.name} | ${totalAmount}đ`,
    );

    // 3. Khởi tạo giao dịch VietQR
    const paymentResult = await this.paymentService.initiatePayment(
      order,
      paymentMethod,
    );

    // 4. Cập nhật trạng thái sang AWAITING_PAYMENT
    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: 'AWAITING_PAYMENT' },
    });

    return {
      orderId: order.id,
      status: 'AWAITING_PAYMENT',
      qrData: paymentResult.qrData,
      bankInfo: paymentResult.rawResponse,
      expiredAt: order.expiredAt,
    };
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { payments: true },
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} không tồn tại`);
    }
    return order;
  }

  async getOrdersByEmail(email: string) {
    return this.prisma.order.findMany({
      where: { customerEmail: email },
      include: { payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancelOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} không tồn tại`);
    }

    if (order.status === 'PAID') {
      throw new BadRequestException(
        'Không thể huỷ đơn hàng đã thanh toán',
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  /**
   * Cập nhật trạng thái đơn hàng sang COMPLETED
   * Dùng sau khi admin đã gửi account cho khách
   */
  async completeOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} không tồn tại`);
    }

    if (order.status !== 'PAID') {
      throw new BadRequestException(
        'Chỉ có thể hoàn tất đơn hàng đã thanh toán',
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }
}
