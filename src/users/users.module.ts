import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { CustomerService } from './services/customer.service';
import { UsersController } from './controllers/users.controller';
import { CustomerController } from './controllers/customer.controller';
import { ProductsModule } from '../products/products.module';
import { User } from './entities/user.entity';
import { Customer } from './entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Customer]), ProductsModule],
  controllers: [UsersController, CustomerController],
  providers: [UsersService, CustomerService],
})
export class UsersModule {}
