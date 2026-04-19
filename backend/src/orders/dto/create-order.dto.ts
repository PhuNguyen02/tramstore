// src/orders/dto/create-order.dto.ts
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

const PAYMENT_METHODS = [
  'VIETQR',
  'BANK_TRANSFER', // backward compat → maps to VietQR
] as const;

export class CreateOrderDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  customerEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên' })
  customerName: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại' })
  customerPhone: string;

  @IsUUID('4', { message: 'productId phải là UUID hợp lệ' })
  productId: string;

  @IsUUID('4', { message: 'variantId phải là UUID hợp lệ' })
  variantId: string;

  @IsIn(PAYMENT_METHODS, {
    message: `Phương thức thanh toán phải là một trong: ${PAYMENT_METHODS.join(', ')}`,
  })
  @IsOptional()
  paymentMethod?: string = 'VIETQR';

  @IsString()
  @IsOptional()
  note?: string;
}
