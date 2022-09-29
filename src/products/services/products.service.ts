import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Product } from '../entities/product.entity';
import { BrandsService } from './brands.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly brandsServices: BrandsService,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { brandId } = createProductDto;
    const newProduct = this.productRepository.create(createProductDto);
    newProduct.brand = await this.brandsServices.findOne(brandId);
    return this.productRepository.save(newProduct);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['brand'] });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { brandId } = updateProductDto;
    const product = await this.findOne(id);
    if (brandId) {
      product.brand = await this.brandsServices.findOne(brandId);
    }
    this.productRepository.merge(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);
    return this.productRepository.delete(id);
  }
}
