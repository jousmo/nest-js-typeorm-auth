import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, FindOptionsWhere, Between } from 'typeorm';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { Product } from '../entities/product.entity';
import { BrandsService } from './brands.service';
import { CategoriesService } from './categories.services';
import { FilterProductDto } from '../dtos/filter-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly brandsServices: BrandsService,
    private readonly categoriesServices: CategoriesService,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { brandId, categoriesIds } = createProductDto;
    const newProduct = this.productRepository.create(createProductDto);
    if (brandId) {
      newProduct.brand = await this.brandsServices.findOne(brandId);
    }

    if (categoriesIds.length) {
      newProduct.categories = await this.categoriesServices.findByIds(
        categoriesIds,
      );
    }

    return this.productRepository.save(newProduct);
  }

  findAll(params?: FilterProductDto): Promise<Product[]> {
    const { limit: take, offset: skip, minPrice, maxPrice } = params;
    let where: FindOptionsWhere<Product> = {};

    if (minPrice && maxPrice) {
      where = {
        price: Between(minPrice, maxPrice),
      };
    }

    return this.productRepository.find({
      where,
      relations: ['brand', 'categories'],
      take,
      skip,
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand', 'categories'],
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
    const { brandId, categoriesIds } = updateProductDto;
    const product = await this.findOne(id);
    if (brandId) {
      product.brand = await this.brandsServices.findOne(brandId);
    }

    if (categoriesIds.length) {
      product.categories = await this.categoriesServices.findByIds(
        categoriesIds,
      );
    }
    this.productRepository.merge(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);
    return this.productRepository.delete(id);
  }

  async removeCategoryByProduct(
    id: number,
    categoryId: number,
  ): Promise<Product> {
    const product = await this.findOne(id);
    await this.categoriesServices.findOne(categoryId);
    product.categories = product.categories.filter(
      (category) => category.id !== categoryId,
    );
    return this.productRepository.save(product);
  }

  async addCategoryByProduct(id: number, categoryId: number): Promise<Product> {
    const product = await this.findOne(id);
    const category = await this.categoriesServices.findOne(categoryId);
    product.categories.push(category);
    return this.productRepository.save(product);
  }
}
