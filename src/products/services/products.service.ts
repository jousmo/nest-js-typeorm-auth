import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Product } from '../entities/product.entity';
import { products } from '../../db/mock.db';

@Injectable()
export class ProductsService {
  #products: Product[] = products;

  #findIndex(id: number): number {
    const index = this.#products.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return index;
  }

  create(createProductDto: CreateProductDto): Product {
    const newProduct: Product = {
      id: this.#products.length + 1,
      ...createProductDto,
    };

    this.#products.push(newProduct);
    return newProduct;
  }

  findAll(): Product[] {
    return this.#products;
  }

  findOne(id: number): Product {
    const index = this.#findIndex(id);
    return this.#products[index];
  }

  update(id: number, updateProductDto: UpdateProductDto): Product {
    const index = this.#findIndex(id);
    const product = this.#products[index];
    this.#products[index] = {
      ...product,
      ...updateProductDto,
    };
    return this.#products[index];
  }

  remove(id: number): boolean {
    const index = this.#findIndex(id);
    this.#products.splice(index, 1);
    return true;
  }
}
