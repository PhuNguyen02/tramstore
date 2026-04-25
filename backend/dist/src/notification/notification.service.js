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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationService = NotificationService_1 = class NotificationService {
    prisma;
    logger = new common_1.Logger(NotificationService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onOrderPaid(payload) {
        const order = await this.prisma.order.findUnique({
            where: { id: payload.orderId },
            include: { payments: true },
        });
        if (!order)
            return;
        this.logger.log(`📧 [KHÁCH HÀNG] Gửi email xác nhận đơn hàng ${order.id} tới ${order.customerEmail}`);
        this.logger.log(`🔔 [ADMIN] Đơn hàng mới! #${order.id.slice(0, 8).toUpperCase()} | ` +
            `${order.customerName} | ${order.customerEmail} | ` +
            `${order.totalAmount}đ | SĐT: ${order.customerPhone}`);
        this.logger.log(`📋 [TODO] Admin cần gửi account cho đơn hàng ${order.id} → email: ${order.customerEmail}`);
    }
    async onOrderFailed(payload) {
        const order = await this.prisma.order.findUnique({
            where: { id: payload.orderId },
        });
        if (!order)
            return;
        this.logger.log(`⚠️ Thông báo thanh toán thất bại tới ${order.customerEmail}`);
    }
};
exports.NotificationService = NotificationService;
__decorate([
    (0, event_emitter_1.OnEvent)('order.paid'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "onOrderPaid", null);
__decorate([
    (0, event_emitter_1.OnEvent)('order.failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationService.prototype, "onOrderFailed", null);
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map