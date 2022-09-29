import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../globals/entities/base.entity';
import { Product } from './product.entity';

@Entity()
export class Brand extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  image: string;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
