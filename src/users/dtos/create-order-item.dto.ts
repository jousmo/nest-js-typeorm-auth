import { IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsPositive()
  @IsNotEmpty()
  readonly orderId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly productId: number;

  @IsPositive()
  @IsNotEmpty()
  readonly quantity: number;
}
