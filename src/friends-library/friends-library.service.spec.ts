import { Test, TestingModule } from '@nestjs/testing';
import { FriendsLibraryService } from './friends-library.service';

describe('FriendsLibraryService', () => {
  let service: FriendsLibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendsLibraryService],
    }).compile();

    service = module.get<FriendsLibraryService>(FriendsLibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
