// src/webhook/webhook.controller.ts
import {
  Body,
  Controller,
  Headers,
  Post,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private webhookService: WebhookService) {}

  /**
   * POST /api/v1/webhooks/sepay
   * SePay webhook callback endpoint
   * Nhận thông tin giao dịch ngân hàng từ SePay khi có tiền vào tài khoản
   *
   * Payload format:
   * {
   *   "id": 92704,
   *   "gateway": "MBBank",
   *   "transactionDate": "2023-03-25 14:02:37",
   *   "accountNumber": "0123499999",
   *   "transferAmount": 2277000,
   *   "content": "TS ABCD1234",
   *   "code": "TSABCD1234",
   *   "referenceCode": "208V009252001511",
   *   "transferType": "in"
   * }
   */
  @Post('sepay')
  @HttpCode(200)
  async sepayWebhook(
    @Body() payload: Record<string, any>,
    @Headers('authorization') authorization: string,
  ) {
    this.logger.log(
      `📥 Received SePay webhook: amount=${payload.transferAmount}, content="${payload.content}", code="${payload.code}"`,
    );
    return this.webhookService.handleSepay(payload, authorization);
  }

  /**
   * POST /api/v1/webhooks/bank-transfer/confirm
   * Bank transfer xác nhận thủ công (admin)
   * Dùng khi cần xác nhận thủ công (backup cho SePay)
   */
  @Post('bank-transfer/confirm')
  async bankConfirm(
    @Body() payload: { orderId: string; txId: string },
    @Headers('x-webhook-secret') secret: string,
  ) {
    this.logger.log(
      `📥 Received manual bank transfer confirmation for order ${payload.orderId}`,
    );
    return this.webhookService.handleManualConfirm(payload, secret);
  }
}
