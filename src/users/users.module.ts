import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { CustomersService } from './services/customers.service';
import { UsersController } from './controllers/users.controller';
import { CustomersController } from './controllers/customers.controller';
import { ProductsModule } from '../products/products.module';
import { User } from './entities/user.entity';
import { Customer } from './entities/customer.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrdersController } from './controllers/orders.controller';
import { OrdersService } from './services/orders.service';
import { OrderItemController } from './controllers/orders-items.controller';
import { OrdersItemsService } from './services/orders-items.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Customer, Order, OrderItem]),
    ProductsModule,
  ],
  controllers: [
    UsersController,
    CustomersController,
    OrdersController,
    OrderItemController,
  ],
  providers: [
    UsersService,
    CustomersService,
    OrdersService,
    OrdersItemsService,
  ],
})
export class UsersModule {}
