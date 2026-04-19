"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const gateway_factory_1 = require("./gateway.factory");
const payos_gateway_1 = require("./gateways/payos.gateway");
const stripe_gateway_1 = require("./gateways/stripe.gateway");
const bank_transfer_gateway_1 = require("./gateways/bank-transfer.gateway");
const paypal_gateway_1 = require("./gateways/paypal.gateway");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        providers: [
            payment_service_1.PaymentService,
            gateway_factory_1.GatewayFactory,
            payos_gateway_1.PayosGateway,
            stripe_gateway_1.StripeGateway,
            bank_transfer_gateway_1.BankTransferGateway,
            paypal_gateway_1.PaypalGateway,
        ],
        exports: [payment_service_1.PaymentService, gateway_factory_1.GatewayFactory],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map