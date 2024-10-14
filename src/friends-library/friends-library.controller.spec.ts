import { Test, TestingModule } from '@nestjs/testing';
import { FriendsLibraryController } from './friends-library.controller';

describe('FriendsLibraryController', () => {
  let controller: FriendsLibraryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendsLibraryController],
    }).compile();

    controller = module.get<FriendsLibraryController>(FriendsLibraryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
