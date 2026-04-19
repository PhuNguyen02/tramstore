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
var StripeGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let StripeGateway = StripeGateway_1 = class StripeGateway {
    config;
    logger = new common_1.Logger(StripeGateway_1.name);
    constructor(config) {
        this.config = config;
    }
    async initiate(order) {
        const secretKey = this.config.get('STRIPE_SECRET_KEY');
        if (!secretKey) {
            this.logger.warn('Stripe chưa được cấu hình. Trả về URL giả lập.');
            return {
                gatewayTxId: `stripe_sim_${order.id}`,
                redirectUrl: `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/orders/${order.id}?status=success`,
                rawResponse: { message: 'Stripe sandbox - chưa cấu hình' },
            };
        }
        this.logger.log(`Stripe payment initiated for order ${order.id}`);
        return {
            gatewayTxId: `stripe_${order.id}`,
            redirectUrl: `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/orders/${order.id}?status=success`,
            rawResponse: { message: 'Stripe - placeholder' },
        };
    }
    verifyWebhook(payload, signature) {
        const webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET');
        if (!webhookSecret)
            return false;
        return true;
    }
};
exports.StripeGateway = StripeGateway;
exports.StripeGateway = StripeGateway = StripeGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StripeGateway);
//# sourceMappingURL=stripe.gateway.js.map