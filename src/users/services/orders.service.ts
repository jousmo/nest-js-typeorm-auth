import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';
import { Order } from '../entities/order.entity';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customerId } = createOrderDto;
    const newOrder = this.orderRepository.create();
    if (customerId) {
      newOrder.customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });
    }

    return this.orderRepository.save(newOrder);
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: {
        customer: true,
        items: {
          product: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const { customerId } = updateOrderDto;
    const order = await this.findOne(id);
    if (customerId) {
      order.customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });
    }
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);
    return this.orderRepository.delete(id);
  }
}
