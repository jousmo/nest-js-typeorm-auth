import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { Product } from './entities/product.entity';
import { Brand } from './entities/brand.entity';
import { BrandsController } from './controllers/brands.controller';
import { BrandsService } from './services/brands.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Brand])],
  controllers: [ProductsController, BrandsController],
  providers: [ProductsService, BrandsService],
  exports: [ProductsService],
})
export class ProductsModule {}
