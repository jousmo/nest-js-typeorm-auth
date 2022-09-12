import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../entities/user.entity';
import { users } from '../../db/mock.db';
import { Order } from '../entities/order.entity';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class UsersService {
  constructor(private readonly productsService: ProductsService) {}

  #users: User[] = users;

  #findIndex(id: number): number {
    const index = this.#users.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return index;
  }

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: this.#users.length + 1,
      ...createUserDto,
    };

    this.#users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.#users;
  }

  findOne(id: number): User {
    const index = this.#findIndex(id);
    return this.#users[index];
  }

  update(id: number, updateUserDto: UpdateUserDto): User {
    const index = this.#findIndex(id);
    const user = this.#users[index];
    this.#users[index] = {
      ...user,
      ...updateUserDto,
    };
    return this.#users[index];
  }

  remove(id: number): boolean {
    const index = this.#findIndex(id);
    this.#users.splice(index, 1);
    return true;
  }

  findMyOrders(id: number): Order {
    const index = this.#findIndex(id);
    const user = this.#users[index];
    const products = this.productsService.findAll();
    return {
      date: new Date(),
      user,
      products,
    };
  }
}
