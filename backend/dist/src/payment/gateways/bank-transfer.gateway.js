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
var BankTransferGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankTransferGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let BankTransferGateway = BankTransferGateway_1 = class BankTransferGateway {
    config;
    logger = new common_1.Logger(BankTransferGateway_1.name);
    constructor(config) {
        this.config = config;
    }
    async initiate(order) {
        const bankAccount = this.config.get('BANK_ACCOUNT_NUMBER') || '1234567890';
        const bankName = this.config.get('BANK_NAME') || 'Vietcombank';
        const bankBin = this.config.get('BANK_BIN') || '970436';
        const transferContent = `TRAMSTORE ${order.id.slice(0, 8).toUpperCase()}`;
        const qrData = this.buildVietQR({
            bankBin,
            accountNumber: bankAccount,
            amount: Number(order.totalAmount),
            description: transferContent,
        });
        this.logger.log(`Bank transfer initiated for order ${order.id}: ${transferContent}`);
        return {
            gatewayTxId: `BANK_${order.id}`,
            qrData,
            rawResponse: {
                bankName,
                bankAccount,
                transferContent,
                amount: order.totalAmount,
            },
        };
    }
    verifyWebhook(payload, signature) {
        const adminSecret = this.config.get('BANK_WEBHOOK_SECRET');
        return signature === adminSecret;
    }
    buildVietQR(params) {
        const { bankBin, accountNumber, amount, description } = params;
        return `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}`;
    }
};
exports.BankTransferGateway = BankTransferGateway;
exports.BankTransferGateway = BankTransferGateway = BankTransferGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], BankTransferGateway);
//# sourceMappingURL=bank-transfer.gateway.js.map