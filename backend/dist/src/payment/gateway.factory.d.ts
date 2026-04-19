import { IPaymentGateway } from './interfaces/payment-gateway.interface';
import { PayosGateway } from './gateways/payos.gateway';
import { StripeGateway } from './gateways/stripe.gateway';
import { BankTransferGateway } from './gateways/bank-transfer.gateway';
import { PaypalGateway } from './gateways/paypal.gateway';
export declare class GatewayFactory {
    private payos;
    private stripe;
    private bankTransfer;
    private paypal;
    constructor(payos: PayosGateway, stripe: StripeGateway, bankTransfer: BankTransferGateway, paypal: PaypalGateway);
    getGateway(method: string): IPaymentGateway;
}
