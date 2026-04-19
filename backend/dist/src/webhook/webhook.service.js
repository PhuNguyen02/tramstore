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
var WebhookService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gateway_factory_1 = require("../payment/gateway.factory");
const event_emitter_1 = require("@nestjs/event-emitter");
let WebhookService = WebhookService_1 = class WebhookService {
    prisma;
    gatewayFactory;
    eventEmitter;
    logger = new common_1.Logger(WebhookService_1.name);
    constructor(prisma, gatewayFactory, eventEmitter) {
        this.prisma = prisma;
        this.gatewayFactory = gatewayFactory;
        this.eventEmitter = eventEmitter;
    }
    async handlePayos(payload) {
        const gateway = this.gatewayFactory.getGateway('PAYOS');
        const signature = payload['signature'] || '';
        if (!gateway.verifyWebhook(payload, signature)) {
            this.logger.warn('PayOS webhook: chữ ký không hợp lệ');
            return { success: false, message: 'Invalid signature' };
        }
        const data = payload['data'];
        if (!data) {
            this.logger.warn('PayOS webhook: không có data');
            return { success: false, message: 'No data' };
        }
        const orderCode = String(data.orderCode);
        const isSuccess = payload['success'] === true && payload['code'] === '00';
        this.logger.log(`PayOS webhook: orderCode=${orderCode}, success=${isSuccess}, code=${payload['code']}`);
        const payment = await this.prisma.payment.findFirst({
            where: { gatewayTxId: orderCode },
            include: { order: true },
        });
        if (!payment) {
            this.logger.warn(`PayOS webhook: không tìm thấy payment với gatewayTxId=${orderCode}`);
            return { success: true };
        }
        await this.updateOrderPaymentStatus(payment.orderId, isSuccess, payload);
        return { success: true };
    }
    async handleStripe(payload, signature) {
        const gateway = this.gatewayFactory.getGateway('STRIPE');
        if (!gateway.verifyWebhook(payload, signature)) {
            this.logger.warn('Stripe webhook: chữ ký không hợp lệ');
            throw new Error('Invalid Stripe signature');
        }
        const event = payload;
        const orderId = event.data.object.metadata.orderId;
        const isSuccess = event.data.object.payment_status === 'paid';
        await this.updateOrderPaymentStatus(orderId, isSuccess, payload);
        return { received: true };
    }
    async handleBankTransfer(payload, secret) {
        const gateway = this.gatewayFactory.getGateway('BANK_TRANSFER');
        if (!gateway.verifyWebhook(payload, secret)) {
            this.logger.warn('Bank transfer webhook: secret không hợp lệ');
            throw new Error('Invalid secret');
        }
        await this.updateOrderPaymentStatus(payload.orderId, true, {
            txId: payload.txId,
        });
        return { success: true };
    }
    async updateOrderPaymentStatus(orderId, isSuccess, rawPayload) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            this.logger.error(`Webhook: không tìm thấy order ${orderId}`);
            return;
        }
        if (order.status === 'PAID' || order.status === 'FAILED') {
            this.logger.log(`Order ${orderId} đã được xử lý trước đó (${order.status}), bỏ qua`);
            return;
        }
        const newStatus = isSuccess ? 'PAID' : 'FAILED';
        const paymentStatus = isSuccess ? 'COMPLETED' : 'FAILED';
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
        const eventName = isSuccess ? 'order.paid' : 'order.failed';
        this.eventEmitter.emit(eventName, { orderId });
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = WebhookService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gateway_factory_1.GatewayFactory,
        event_emitter_1.EventEmitter2])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map