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
var VnpayGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VnpayGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const qs = __importStar(require("qs"));
let VnpayGateway = VnpayGateway_1 = class VnpayGateway {
    config;
    logger = new common_1.Logger(VnpayGateway_1.name);
    tmnCode;
    secretKey;
    returnUrl;
    vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    constructor(config) {
        this.config = config;
        this.tmnCode = config.get('VNPAY_TMN_CODE') || '';
        this.secretKey = config.get('VNPAY_SECRET_KEY') || '';
        this.returnUrl = config.get('VNPAY_RETURN_URL') || '';
    }
    async initiate(order) {
        if (!this.tmnCode || !this.secretKey) {
            this.logger.warn('VNPay chưa được cấu hình. Trả về URL giả lập.');
            return {
                gatewayTxId: order.id,
                redirectUrl: `${this.config.get('FRONTEND_URL') || 'http://localhost:3000'}/payment/return?vnp_TxnRef=${order.id}&vnp_ResponseCode=00`,
                rawResponse: { message: 'VNPay sandbox - chưa cấu hình' },
            };
        }
        const date = new Date();
        const createDate = this.formatDate(date);
        const expireDate = this.formatDate(new Date(date.getTime() + 15 * 60 * 1000));
        const params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: this.tmnCode,
            vnp_Amount: String(Number(order.totalAmount) * 100),
            vnp_CreateDate: createDate,
            vnp_CurrCode: 'VND',
            vnp_IpAddr: '127.0.0.1',
            vnp_Locale: 'vn',
            vnp_OrderInfo: `Thanh toan don hang ${order.id}`,
            vnp_OrderType: 'other',
            vnp_ReturnUrl: this.returnUrl,
            vnp_TxnRef: order.id,
            vnp_ExpireDate: expireDate,
        };
        const sortedParams = Object.keys(params)
            .sort()
            .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});
        const signData = qs.stringify(sortedParams, { encode: false });
        const signature = crypto
            .createHmac('sha512', this.secretKey)
            .update(signData)
            .digest('hex');
        const redirectUrl = `${this.vnpUrl}?${signData}&vnp_SecureHash=${signature}`;
        this.logger.log(`VNPay payment initiated for order ${order.id}`);
        return {
            gatewayTxId: order.id,
            redirectUrl,
            rawResponse: params,
        };
    }
    verifyWebhook(payload, signature) {
        if (!this.secretKey)
            return false;
        const params = { ...payload };
        delete params['vnp_SecureHash'];
        delete params['vnp_SecureHashType'];
        const sortedData = Object.keys(params)
            .sort()
            .reduce((acc, key) => ({ ...acc, [key]: params[key] }), {});
        const signData = qs.stringify(sortedData, { encode: false });
        const expected = crypto
            .createHmac('sha512', this.secretKey)
            .update(signData)
            .digest('hex');
        return expected === payload['vnp_SecureHash'];
    }
    formatDate(date) {
        return date
            .toISOString()
            .replace(/[-:T.Z]/g, '')
            .slice(0, 14);
    }
};
exports.VnpayGateway = VnpayGateway;
exports.VnpayGateway = VnpayGateway = VnpayGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], VnpayGateway);
//# sourceMappingURL=vnpay.gateway.js.map