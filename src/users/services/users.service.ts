import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Client } from 'pg';
import bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { ProductsService } from '../../products/services/products.service';
import { CustomersService } from './customers.service';
import { OrdersService } from './orders.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
    private readonly ordersService: OrdersService,
    @Inject('PG') private readonly pg: Client,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { customerId, password } = createUserDto;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create(createUserDto);
    newUser.password = hashPassword;
    if (customerId) {
      newUser.customer = await this.customersService.findOne(customerId);
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
      user.customer = await this.customersService.findOne(customerId);
    }
    this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);
    return this.userRepository.delete(id);
  }

  async findMyOrders(id: number): Promise<Order[]> {
    const user = await this.findOne(id);
    const { id: customerId } = user.customer;
    if (!customerId) {
      throw new NotFoundException(`User #${id} not customer found`);
    }
    const customer = await this.customersService.findOne(customerId);
    return customer.orders;
  }

  async findQueryNow(): Promise<object> {
    const { rows } = await this.pg.query('SELECT NOW() AS now');
    return rows[0];
  }

  findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }
}
