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
    async handleSepay(payload, authorization) {
        const gateway = this.gatewayFactory.getGateway('VIETQR');
        const apiKey = authorization?.replace(/^Apikey\s+/i, '') || authorization || '';
        if (!gateway.verifyWebhook(payload, apiKey)) {
            this.logger.warn('❌ SePay webhook: API key không hợp lệ');
            return { success: false, message: 'Invalid API key' };
        }
        if (payload.transferType && payload.transferType !== 'in') {
            this.logger.log('ℹ️ SePay webhook: bỏ qua giao dịch tiền ra');
            return { success: true, message: 'Ignored outgoing transaction' };
        }
        const transferAmount = Number(payload.transferAmount);
        const content = String(payload.content || '').toUpperCase();
        const code = String(payload.code || '').toUpperCase();
        const referenceCode = payload.referenceCode || '';
        this.logger.log(`💰 SePay: amount=${transferAmount}, content="${content}", code="${code}", ref="${referenceCode}"`);
        const payment = await this.findPaymentByTransferContent(content, code);
        if (!payment) {
            this.logger.warn(`⚠️ SePay webhook: không tìm thấy payment cho content="${content}", code="${code}"`);
            return { success: true, message: 'No matching order found' };
        }
        const expectedAmount = Number(payment.amount);
        if (Math.abs(transferAmount - expectedAmount) > 1) {
            this.logger.warn(`⚠️ SePay: số tiền không khớp! expected=${expectedAmount}, received=${transferAmount}`);
        }
        await this.updateOrderPaymentStatus(payment.orderId, true, {
            sepayId: payload.id,
            gateway: payload.gateway,
            transactionDate: payload.transactionDate,
            transferAmount,
            content,
            referenceCode,
        });
        return { success: true };
    }
    async handleManualConfirm(payload, secret) {
        const gateway = this.gatewayFactory.getGateway('BANK_TRANSFER');
        if (!gateway.verifyWebhook(payload, secret)) {
            this.logger.warn('❌ Manual confirm: secret không hợp lệ');
            throw new Error('Invalid secret');
        }
        await this.updateOrderPaymentStatus(payload.orderId, true, {
            txId: payload.txId,
            manual: true,
        });
        return { success: true };
    }
    async findPaymentByTransferContent(content, code) {
        if (code) {
            const byCode = await this.prisma.payment.findFirst({
                where: {
                    gatewayTxId: code,
                    status: 'INITIATED',
                },
                include: { order: true },
            });
            if (byCode)
                return byCode;
        }
        const tsMatch = content.match(/TS([A-Z0-9]{8})/);
        if (tsMatch) {
            const tsCode = tsMatch[0];
            const byContent = await this.prisma.payment.findFirst({
                where: {
                    gatewayTxId: tsCode,
                    status: 'INITIATED',
                },
                include: { order: true },
            });
            if (byContent)
                return byContent;
        }
        return null;
    }
    async updateOrderPaymentStatus(orderId, isSuccess, rawPayload) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            this.logger.error(`❌ Webhook: không tìm thấy order ${orderId}`);
            return;
        }
        if (order.status === 'PAID' || order.status === 'FAILED') {
            this.logger.log(`ℹ️ Order ${orderId} đã được xử lý trước đó (${order.status}), bỏ qua`);
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