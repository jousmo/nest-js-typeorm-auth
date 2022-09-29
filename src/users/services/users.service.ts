import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Client } from 'pg';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { ProductsService } from '../../products/services/products.service';
import { CustomerService } from './customer.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly customerService: CustomerService,
    @Inject('PG') private readonly pg: Client,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { customerId } = createUserDto;
    const newUser = this.userRepository.create(createUserDto);
    if (customerId) {
      newUser.customer = await this.customerService.findOne(customerId);
    }
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['customer'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { customerId } = updateUserDto;
    const user = await this.findOne(id);
    if (customerId) {
      user.customer = await this.customerService.findOne(customerId);
    }
    this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);
    return this.userRepository.delete(id);
  }

  async findMyOrders(id: number): Promise<Order> {
    const user = await this.findOne(id);
    const products = await this.productsService.findAll();
    return {
      date: new Date(),
      user,
      products,
    };
  }

  async findQueryNow(): Promise<object> {
    const { rows } = await this.pg.query('SELECT NOW() AS now');
    return rows[0];
  }
}
