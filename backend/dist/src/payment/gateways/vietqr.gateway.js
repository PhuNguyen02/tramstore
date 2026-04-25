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
var VietqrGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VietqrGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let VietqrGateway = VietqrGateway_1 = class VietqrGateway {
    config;
    logger = new common_1.Logger(VietqrGateway_1.name);
    bankBin;
    accountNumber;
    accountName;
    bankName;
    template;
    sepayWebhookSecret;
    constructor(config) {
        this.config = config;
        this.bankBin = config.get('VIETQR_BANK_BIN') || '970422';
        this.accountNumber = config.get('VIETQR_ACCOUNT_NUMBER') || '';
        this.accountName = config.get('VIETQR_ACCOUNT_NAME') || 'TRAM STORE';
        this.bankName = config.get('VIETQR_BANK_NAME') || 'MB Bank';
        this.template = config.get('VIETQR_TEMPLATE') || 'compact2';
        this.sepayWebhookSecret = config.get('SEPAY_WEBHOOK_SECRET') || '';
        if (!this.accountNumber) {
            this.logger.warn('⚠️ VIETQR_ACCOUNT_NUMBER chưa được cấu hình. Vui lòng cập nhật .env');
        }
        else {
            this.logger.log(`✅ VietQR gateway initialized: ${this.bankName} - ${this.accountNumber}`);
        }
    }
    async initiate(order) {
        const amount = Math.round(Number(order.totalAmount));
        const transferContent = this.generateTransferContent(order.id);
        const qrUrl = this.buildVietQRUrl({
            amount,
            description: transferContent,
        });
        this.logger.log(`VietQR payment initiated: order=${order.id}, amount=${amount}, content="${transferContent}"`);
        return {
            gatewayTxId: transferContent,
            qrData: qrUrl,
            rawResponse: {
                bankName: this.bankName,
                bankBin: this.bankBin,
                accountNumber: this.accountNumber,
                accountName: this.accountName,
                transferContent,
                amount,
                qrUrl,
            },
        };
    }
    verifyWebhook(payload, signature) {
        if (!this.sepayWebhookSecret) {
            this.logger.warn('SEPAY_WEBHOOK_SECRET chưa được cấu hình');
            return false;
        }
        return signature === this.sepayWebhookSecret;
    }
    generateTransferContent(orderId) {
        const code = orderId.replace(/-/g, '').slice(-8).toUpperCase();
        return `TS${code}`;
    }
    buildVietQRUrl(params) {
        const { amount, description } = params;
        const baseUrl = `https://img.vietqr.io/image/${this.bankBin}-${this.accountNumber}-${this.template}.png`;
        const queryParams = new URLSearchParams({
            amount: String(amount),
            addInfo: description,
            accountName: this.accountName,
        });
        return `${baseUrl}?${queryParams.toString()}`;
    }
};
exports.VietqrGateway = VietqrGateway;
exports.VietqrGateway = VietqrGateway = VietqrGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VietqrGateway);
//# sourceMappingURL=vietqr.gateway.js.map