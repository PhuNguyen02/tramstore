// src/orders/orders.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * POST /api/v1/orders
   * Tạo đơn hàng mới và khởi tạo giao dịch VietQR
   * Returns: orderId, qrData (VietQR URL), bankInfo, expiredAt
   */
  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  /**
   * GET /api/v1/orders/:id
   * Lấy chi tiết đơn hàng theo ID (dùng cho polling trạng thái)
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  /**
   * GET /api/v1/orders?email=abc@example.com
   * Lấy danh sách đơn hàng theo email
   */
  @Get()
  findByEmail(@Query('email') email: string) {
    return this.ordersService.getOrdersByEmail(email);
  }

  /**
   * PATCH /api/v1/orders/:id/cancel
   * Huỷ đơn hàng
   */
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.ordersService.cancelOrder(id);
  }

  /**
   * PATCH /api/v1/orders/:id/complete
   * Admin đánh dấu đơn hàng hoàn tất (sau khi gửi account cho khách)
   */
  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.ordersService.completeOrder(id);
  }
}
