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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayFactory = void 0;
const common_1 = require("@nestjs/common");
const payos_gateway_1 = require("./gateways/payos.gateway");
const stripe_gateway_1 = require("./gateways/stripe.gateway");
const bank_transfer_gateway_1 = require("./gateways/bank-transfer.gateway");
const paypal_gateway_1 = require("./gateways/paypal.gateway");
const PaymentMethod = {
    BANK_TRANSFER: 'BANK_TRANSFER',
    PAYOS: 'PAYOS',
    VNPAY: 'VNPAY',
    MOMO: 'MOMO',
    STRIPE: 'STRIPE',
    PAYPAL: 'PAYPAL',
};
let GatewayFactory = class GatewayFactory {
    payos;
    stripe;
    bankTransfer;
    paypal;
    constructor(payos, stripe, bankTransfer, paypal) {
        this.payos = payos;
        this.stripe = stripe;
        this.bankTransfer = bankTransfer;
        this.paypal = paypal;
    }
    getGateway(method) {
        const map = {
            [PaymentMethod.PAYOS]: this.payos,
            [PaymentMethod.VNPAY]: this.payos,
            [PaymentMethod.MOMO]: this.payos,
            [PaymentMethod.STRIPE]: this.stripe,
            [PaymentMethod.PAYPAL]: this.paypal,
            [PaymentMethod.BANK_TRANSFER]: this.bankTransfer,
        };
        const gateway = map[method];
        if (!gateway) {
            throw new Error(`Phương thức thanh toán không được hỗ trợ: ${method}`);
        }
        return gateway;
    }
};
exports.GatewayFactory = GatewayFactory;
exports.GatewayFactory = GatewayFactory = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payos_gateway_1.PayosGateway,
        stripe_gateway_1.StripeGateway,
        bank_transfer_gateway_1.BankTransferGateway,
        paypal_gateway_1.PaypalGateway])
], GatewayFactory);
//# sourceMappingURL=gateway.factory.js.map