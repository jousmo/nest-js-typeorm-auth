import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../globals/entities/base.entity';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  phone: string;

  @OneToOne(() => User, (user) => user.customer, { nullable: true })
  user: User;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
