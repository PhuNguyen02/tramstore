"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const payment_service_1 = require("../payment/payment.service");
let OrdersService = OrdersService_1 = class OrdersService {
    prisma;
    paymentService;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(prisma, paymentService) {
        this.prisma = prisma;
        this.paymentService = paymentService;
    }
    async createOrder(dto) {
        const variant = await this.prisma.variant.findUnique({
            where: { id: dto.variantId },
            include: { product: true },
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Variant ${dto.variantId} không tồn tại`);
        }
        if (variant.productId !== dto.productId) {
            throw new common_1.BadRequestException('Variant không thuộc sản phẩm đã chọn');
        }
        const totalAmount = variant.price;
        const expiredAt = new Date(Date.now() + 15 * 60 * 1000);
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
        this.logger.log(`Order created: ${order.id} | ${variant.product.name} - ${variant.name} | ${totalAmount}đ`);
        const paymentResult = await this.paymentService.initiatePayment(order, dto.paymentMethod);
        await this.prisma.order.update({
            where: { id: order.id },
            data: { status: 'AWAITING_PAYMENT' },
        });
        return {
            orderId: order.id,
            status: 'AWAITING_PAYMENT',
            paymentUrl: paymentResult.redirectUrl,
            qrData: paymentResult.qrData,
            bankInfo: paymentResult.rawResponse,
            expiredAt: order.expiredAt,
        };
    }
    async getOrderById(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { payments: true },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order ${id} không tồn tại`);
        }
        return order;
    }
    async getOrdersByEmail(email) {
        return this.prisma.order.findMany({
            where: { customerEmail: email },
            include: { payments: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async cancelOrder(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order ${id} không tồn tại`);
        }
        if (order.status === 'PAID') {
            throw new common_1.BadRequestException('Không thể huỷ đơn hàng đã thanh toán');
        }
        return this.prisma.order.update({
            where: { id },
            data: { status: 'CANCELLED' },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payment_service_1.PaymentService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map