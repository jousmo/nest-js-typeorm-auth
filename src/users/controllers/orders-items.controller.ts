import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';
import { OrdersItemsService } from '../services/orders-items.service';

@Controller('orders-items')
export class OrderItemController {
  constructor(private readonly ordersItemsService: OrdersItemsService) {}

  @Post()
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.ordersItemsService.create(createOrderItemDto);
  }
}
