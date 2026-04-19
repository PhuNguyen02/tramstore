"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PayosGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayosGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
let PayosGateway = PayosGateway_1 = class PayosGateway {
    config;
    logger = new common_1.Logger(PayosGateway_1.name);
    payosClient = null;
    clientId;
    apiKey;
    checksumKey;
    constructor(config) {
        this.config = config;
        this.clientId = config.get('PAYOS_CLIENT_ID') || '';
        this.apiKey = config.get('PAYOS_API_KEY') || '';
        this.checksumKey = config.get('PAYOS_CHECKSUM_KEY') || '';
        this.initClient();
    }
    async initClient() {
        if (!this.clientId || !this.apiKey || !this.checksumKey) {
            this.logger.warn('PayOS chưa được cấu hình đầy đủ (PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY). Chạy ở chế độ giả lập.');
            return;
        }
        try {
            const payosModule = require('@payos/node');
            const PayOSClass = typeof payosModule === 'function'
                ? payosModule
                : typeof payosModule.default === 'function'
                    ? payosModule.default
                    : payosModule.PayOS;
            if (!PayOSClass) {
                this.logger.error(`PayOS module exports: ${Object.keys(payosModule).join(', ')}`);
                throw new Error('Không tìm thấy PayOS constructor');
            }
            this.payosClient = new PayOSClass(this.clientId, this.apiKey, this.checksumKey);
            this.logger.log('✅ PayOS client initialized successfully');
        }
        catch (err) {
            this.logger.warn(`PayOS SDK init failed: ${err.message}`);
        }
    }
    async initiate(order) {
        const orderCode = this.generateOrderCode();
        if (!this.payosClient) {
            this.logger.warn('PayOS client chưa sẵn sàng. Trả về URL giả lập.');
            return {
                gatewayTxId: String(orderCode),
                redirectUrl: `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/payment/return?orderCode=${orderCode}&status=PAID`,
                qrData: `https://img.vietqr.io/image/970422-113366668888-compact2.png?amount=${Math.round(Number(order.totalAmount))}&addInfo=${encodeURIComponent(`TRAMSTORE ${order.id.slice(0, 8).toUpperCase()}`)}`,
                rawResponse: {
                    message: 'PayOS demo mode - chưa cấu hình',
                    orderCode,
                    orderId: order.id,
                },
            };
        }
        try {
            const cancelUrl = this.config.get('PAYOS_CANCEL_URL') ||
                `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/payment/cancel`;
            const returnUrl = this.config.get('PAYOS_RETURN_URL') ||
                `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/payment/return`;
            const paymentData = {
                orderCode,
                amount: Math.round(Number(order.totalAmount)),
                description: `TRAMSTORE ${order.id.slice(0, 8).toUpperCase()}`,
                buyerName: order.customerName || undefined,
                buyerEmail: order.customerEmail || undefined,
                buyerPhone: order.customerPhone || undefined,
                items: [
                    {
                        name: `Đơn hàng #${order.id.slice(0, 8)}`,
                        quantity: order.quantity || 1,
                        price: Math.round(Number(order.unitPrice)),
                    },
                ],
                cancelUrl,
                returnUrl,
                expiredAt: Math.floor((order.expiredAt
                    ? new Date(order.expiredAt).getTime()
                    : Date.now() + 15 * 60 * 1000) / 1000),
            };
            this.logger.log(`Creating PayOS payment: orderCode=${orderCode}, amount=${paymentData.amount}`);
            const paymentLink = await this.payosClient.createPaymentLink(paymentData);
            this.logger.log(`✅ PayOS payment link created: ${paymentLink.checkoutUrl}`);
            return {
                gatewayTxId: String(orderCode),
                redirectUrl: paymentLink.checkoutUrl,
                qrData: paymentLink.qrCode,
                rawResponse: {
                    ...paymentLink,
                    internalOrderId: order.id,
                    orderCode,
                },
            };
        }
        catch (err) {
            this.logger.error(`PayOS createPaymentLink failed: ${err.message}`);
            throw new Error(`Không thể tạo link thanh toán PayOS: ${err.message}`);
        }
    }
    verifyWebhook(payload, signature) {
        if (!this.checksumKey)
            return false;
        try {
            if (this.payosClient) {
                const verified = this.payosClient.verifyPaymentWebhookData(payload);
                return !!verified;
            }
            const data = payload['data'];
            if (!data)
                return false;
            const sortedKeys = Object.keys(data).sort();
            const signData = sortedKeys
                .map((key) => `${key}=${data[key]}`)
                .join('&');
            const expected = crypto
                .createHmac('sha256', this.checksumKey)
                .update(signData)
                .digest('hex');
            return expected === signature;
        }
        catch (err) {
            this.logger.error(`PayOS webhook verification failed: ${err.message}`);
            return false;
        }
    }
    generateOrderCode() {
        const timestamp = Date.now() % 100000000;
        const random = Math.floor(Math.random() * 10000);
        return (timestamp * 10000 + random) % 2147483647;
    }
};
exports.PayosGateway = PayosGateway;
exports.PayosGateway = PayosGateway = PayosGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PayosGateway);
//# sourceMappingURL=payos.gateway.js.map