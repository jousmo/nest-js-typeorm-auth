import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { GlobalsModule } from './globals/globals.module';

@Module({
  imports: [GlobalsModule, UsersModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
