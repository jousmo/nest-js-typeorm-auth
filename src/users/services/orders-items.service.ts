import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../../products/entities/product.entity';
import { CreateOrderItemDto } from '../dtos/create-order-item.dto';
import { UpdateOrderItemDto } from '../dtos/update-order-item.dto';

@Injectable()
export class OrdersItemsService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
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

  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const { orderId, productId } = updateOrderItemDto;

    const item = await this.orderItemRepository.findOne({
      where: { id },
    });

    if (orderId) {
      item.order = await this.orderRepository.findOne({
        where: { id: orderId },
      });
    }

    if (productId) {
      item.product = await this.productRepository.findOne({
        where: { id: productId },
      });
    }

    this.orderItemRepository.merge(item, updateOrderItemDto);
    return this.orderItemRepository.save(item);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.orderItemRepository.delete(id);
  }
}
