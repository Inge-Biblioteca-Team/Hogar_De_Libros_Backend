import { Test, TestingModule } from '@nestjs/testing';
import { EventsCronService } from './events-cron.service';

describe('EventsCronService', () => {
  let service: EventsCronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsCronService],
    }).compile();

    service = module.get<EventsCronService>(EventsCronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
