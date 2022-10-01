import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemController } from './orders-items.controller';
import { OrdersItemsService } from '../services/orders-items.service';

describe('OrdersItemsController', () => {
  let controller: OrderItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemController],
      providers: [OrdersItemsService],
    }).compile();

    controller = module.get<OrderItemController>(OrderItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
