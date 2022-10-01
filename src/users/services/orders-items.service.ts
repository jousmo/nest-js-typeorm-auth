import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../../products/entities/product.entity';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';

@Injectable()
export class OrdersItemsService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    const { orderId, productId, quantity } = createOrderItemDto;
    const item = this.orderItemRepository.create();
    item.order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    item.product = await this.productRepository.findOne({
      where: { id: productId },
    });
    item.quantity = quantity;
    return this.orderItemRepository.save(item);
  }
}
