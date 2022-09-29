import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../globals/entities/base.entity';
import { Brand } from './brand.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'varchar', length: 255 })
  image: string;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;
}
