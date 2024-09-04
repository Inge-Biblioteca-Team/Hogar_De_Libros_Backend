import { Test, TestingModule } from '@nestjs/testing';
import { BookChildrenController } from './book-children.controller';

describe('BookChildrenController', () => {
  let controller: BookChildrenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookChildrenController],
    }).compile();

    controller = module.get<BookChildrenController>(BookChildrenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
