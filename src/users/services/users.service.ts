import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Client } from 'pg';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly productsService: ProductsService,
    @Inject('PG') private readonly pg: Client,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
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
