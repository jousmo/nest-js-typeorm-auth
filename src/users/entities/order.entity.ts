import { User } from './user.entity';
import { Product } from '../../products/entities/product.entity';

export type Order = {
  date: Date;
  user: User;
  products: Product[];
};
