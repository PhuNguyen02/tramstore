import { IPaymentGateway } from './interfaces/payment-gateway.interface';
import { VietqrGateway } from './gateways/vietqr.gateway';
import { BankTransferGateway } from './gateways/bank-transfer.gateway';
export declare class GatewayFactory {
    private vietqr;
    private bankTransfer;
    constructor(vietqr: VietqrGateway, bankTransfer: BankTransferGateway);
    getGateway(method: string): IPaymentGateway;
}
